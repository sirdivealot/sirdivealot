var fs = require('fs-extra')
var path = require('path')
var cluster = require('cluster')
var cpus = require('os').cpus().length
var imageminMozjpeg = require('imagemin-mozjpeg')({
	progressive: true,
	quality: 80,
	doScanOpt: 1,
	trellis: true,
	trellisDC: true,
	dct: "int"
})

var optimize = function (src, dst) {
	var data = fs.readFileSync(src)
	var img = path.relative(__dirname + "/src", src)
	return imageminMozjpeg(data)
		.then(buf => {
			buf = buf.length < data.length ? buf : data
			fs.ensureDirSync(path.dirname(dst))
			fs.writeFileSync(dst, buf)
			console.log('      > ' + img)
		})
		.catch(err => {
			console.error(err)
		})
}

if (cluster.isWorker) {
	async function start(image) {
		await optimize(image.src, image.dst)
		process.send({ cmd: "request" })
	}

	process.send({ cmd: "request" })

	process.on('message', msg => {
		if (msg.cmd === "optimize")
			start(msg.image)
	})
}

module.exports = function (to_optimize) {
	return new Promise(function (F, R) {
		if (cluster.isMaster) {
			console.log('    > Optimizing ' + to_optimize.length + ' images using ' + cpus + ' workers ...')
			var image_counter = 0

			for (var i = 0; i < cpus; i++) {
				var worker = cluster.fork()
				worker.on('message', function (msg) {
					if (msg.cmd && msg.cmd === "request") {
						if (image_counter >= to_optimize.length) {
							this.disconnect()
							return
						}
						this.send({
							cmd: "optimize",
							image: to_optimize[image_counter++]
						})
					}
				})
			}

			cluster.on('exit', (w,c,s) => {
				const alive = Object.keys(cluster.workers).length
				if (alive === 0)
					F()
			})
		}
	})
}