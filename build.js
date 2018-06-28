const   fs = require('fs-extra')
const ansi = require('ansi-escape-sequences')
const path = require('path')
const  DEV = process.env["NODE_ENV"] !== "production"

process.env.dev = DEV
process.env.dir = DEV
	? "file://" + path.join(__dirname, 'dist')
	: ""

var pages = [
	{ src: 'index.js'           , dst: 'index.html'            },

	{ src: 'blog/index.js'      , dst: 'blog/index.html'       },
	{ src: 'blog/sipadan.js'    , dst: 'blog/sipadan.html'     },
	{ src: 'blog/howto.js'      , dst: 'blog/howto.html'       },

	{ src: 'dives/index.js'     , dst: 'dives/index.html'      },
	{ src: 'dives/mabul17.js'   , dst: 'dives/mabul17.html'    },
	{ src: 'dives/weh18.js'     , dst: 'dives/weh18.html'      },
	{ src: 'dives/tulamben18.js', dst: 'dives/tulamben18.html' },

	{ src: 'gear/index.js'      , dst: 'gear/index.html'       },
	{ src: 'world/index.js'     , dst: 'world/index.html'      },
]

function clr (text, color) {
	return process.stdout.isTTY ? ansi.format(text, color) : text
}

function lpad (str, len) {
	while (str.length < len)
		str += ' '
	return str
}

var compile_error = ""
function compile(src, dst) {
	const id = src
	var res = ""
	src = path.join(__dirname, 'src/', src)
	dst = path.join(__dirname, 'dist/', dst)
	fs.ensureDirSync(path.dirname(dst))
	try {
		const source = require(src)
		const drain  = fs.createWriteStream(dst)
		source(drain, dst)
		drain.end()
		res = clr("Ok", 'green')
	} catch (e) {
		compile_error = e
		res = clr("Err", 'red')
	}
	console.log(ansi.cursor.forward(4) + '> Compiling',
			clr(lpad(id, 37), 'cyan'),
			res)
}

function only_newer(src, dst) {
	try {
		const a = fs.statSync(src)
		if (a.isDirectory()) return true

		const b = fs.statSync(dst)
		return Date.parse(a.mtime) > Date.parse(b.mtime)
	} catch (e) { }
	return true
}

function copy(src, dst) {
	process.stdout.write(ansi.cursor.forward(6) +
		'> Copying ' + lpad(src + ' ...', 38))
	src = path.join(__dirname, 'src/', src)
	dst = path.join(__dirname, 'dist/', dst)
	try {
		fs.copySync(src, dst, {
			overwrite: true,
			   filter: only_newer
		})
		process.stdout.write(clr("Ok", 'green'))
	} catch (e) {
		process.stdout.write(clr("Err", 'red'))
	}
	console.log()
}

async function build_css() {
	console.log(ansi.cursor.forward(4) +
		'> Copying stylesheets ...')
	copy('css/', 'css/')
}

async function build_img() {
	console.log(ansi.cursor.forward(4) +
		'> Optimizing images ...')

	var to_optimize = []

	function collect_images(src, dst) {
		src = path.join(__dirname, 'src/', src)
		dst = path.join(__dirname, 'dist/', dst)
		fs.copySync(src, dst, {
			overwrite: true,
			   filter: (a, b) => {
			 		if (only_newer(a, b) && path.parse(a).ext.indexOf('.jp') === 0)
			 			to_optimize.push({src: a, dst: b})
			 		if (path.parse(a).ext === '') return true
			 		return false
			   }
		})
	}

	collect_images('img/', 'img/')
	collect_images('img/mabul17/', 'img/mabul17/')

	var imageminMozjpeg = require('imagemin-mozjpeg')()
	var optimize = function (src, dst) {
		var data = fs.readFileSync(src)
		var img = path.relative(__dirname + "/src/img", src)
		var txt = clr(lpad(img, 35), 'cyan')
		process.stdout.write(ansi.cursor.forward(6) + '> Optimizing ' + txt)
		return imageminMozjpeg(data)
			.then(buf => {
				buf = buf.length < data.length ? buf : data
				fs.writeFileSync(dst, buf)
				process.stdout.write(clr("Ok", 'green'))
				console.log()
			})
			.catch(err => {
				process.stdout.write(clr("Err", 'red'))
				console.log()
				console.error(err)
			})
	}

	//to_optimize = to_optimize.slice(0, 10)
	// 390

	for (var i = 0; i < to_optimize.length; i++)
		await optimize(to_optimize[i].src, to_optimize[i].dst)
}

function build_js() {
	console.log(ansi.cursor.forward(4) +
		'> Copying javascript ...')

	copy('js/', 'js/')
}

function build_pages() {
	pages.forEach(page => compile(page.src, page.dst))
}

async function build(filename) {
	console.log()

	if (filename && filename !== 'build.js') {
		var file = path.parse(filename)

		if (file.ext === '.css')
			build_css()

		if (file.ext === '.img') {
			copy(filename, filename)
			//build_img()
		}

		if (file.ext === '.js') {
			const id = filename.split(path.sep).join('/')
			const page = (pages.filter(page => page.src === id) || [undefined]).pop()

			if (page)
				compile(page.src, page.dst)
			else {
				build_js()
				console.log()

				build_pages()
			}
		}

		console.log()
	} else {
		await build_img()
		console.log()

		build_css()
		console.log()

		build_js()
		console.log()

		build_pages()
		console.log()
	}

	if (compile_error) {
		console.log('  >', clr('Compilation error:', 'red'), compile_error.message)
		console.log(compile_error.stack)
		console.log()
	}
}

module.exports = async function (filename) {
	const time = Date.now()
	await build(filename)

	console.log('  Build took', clr((Date.now() - time).toString(), 'gray'), 'ms')
}