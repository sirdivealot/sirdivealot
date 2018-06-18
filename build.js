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
			clr(lpad(id, 22), 'cyan'),
			res)
}

function copy(src, dst) {
	process.stdout.write(ansi.cursor.forward(6) +
		'> Copying ' + lpad(src + ' ...', 23))
	src = path.join(__dirname, 'src/', src)
	dst = path.join(__dirname, 'dist/', dst)
	try {
		fs.copySync(src, dst, {
			overwrite: true
		})
		process.stdout.write(clr("Ok", 'green'))
	} catch (e) {
		process.stdout.write(clr("Err", 'red'))
	}
	console.log()
}

function build_css() {
	console.log(ansi.cursor.forward(4) +
		'> Copying stylesheets ...')
	copy('css/', 'css/')
}

function build_img() {
	console.log(ansi.cursor.forward(4) +
		'> Copying images ...')

	copy('img/', 'img/')
	copy('img/mabul17/', 'img/mabul17/')
}

function build_js() {
	console.log(ansi.cursor.forward(4) +
		'> Copying javascript ...')

	copy('js/', 'js/')
}

function build_pages() {
	pages.forEach(page => compile(page.src, page.dst))
}

function build(filename) {
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
		build_img()
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

module.exports = function (filename) {
	const time = Date.now()
	build(filename)

	console.log('  Build took', clr((Date.now() - time).toString(), 'gray'), 'ms')
}