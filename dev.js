const fs   = require('fs-extra')
const path = require('path')
const lr   = require('livereload')
const ansi = require('ansi-escape-sequences')

fs.ensureDirSync(path.join(__dirname, 'dist'))

/**
 * Removes a module from the cache
 */
function purgeCache(moduleName) {
    // Traverse the cache looking for the files
    // loaded by the specified module name
    searchCache(moduleName, function (mod) {
        delete require.cache[mod.id];
    });

    // Remove cached paths to the module.
    // Thanks to @bentael for pointing this out.
    Object.keys(module.constructor._pathCache).forEach(function(cacheKey) {
        if (cacheKey.indexOf(moduleName)>0) {
            delete module.constructor._pathCache[cacheKey];
        }
    });
};

/**
 * Traverses the cache to search for all the cached
 * files of the specified module name
 */
function searchCache(moduleName, callback) {
    // Resolve the module identified by the specified name
    var mod = require.resolve(moduleName);

    // Check if the module has been resolved and found within
    // the cache
    if (mod && ((mod = require.cache[mod]) !== undefined)) {
        // Recursively go over the results
        (function traverse(mod) {
            // Go over each of the module's children and
            // traverse them
            mod.children.forEach(function (child) {
                traverse(child);
            });

            // Call the specified callback providing the
            // found cached module
            callback(mod);
        }(mod));
    }
}

function clr (text, color) {
    return process.stdout.isTTY ? ansi.format(text, color) : text
}

function write_status(file) {
    process.stdout.write(ansi.erase.display(2))
    const connected = server.server._server._connections > 0

    var str = "LiveReload: "
    str += clr(connected ? "connected" : "waiting", connected ? "green" : "yellow")
    str += "\n"
    process.stdout.write(ansi.cursor.down(1))
    process.stdout.write(ansi.cursor.forward(2))
    process.stdout.write(str)

    if (file) {
        str = "> File " +
            clr(file, 'cyan') +
            " triggered rebuild on " +
            (new Date()).toISOString() + "\n"
        process.stdout.write(ansi.cursor.down(1))
        process.stdout.write(ansi.cursor.forward(2))
        process.stdout.write(str)
    }
}

var id = 0
function rebuild(evt, fname) {
    if (evt !== 'change') return
    if (id !== 0) return

    if (!fname.length) fname = undefined
    id = setTimeout(() => {
        id = 0
        write_status(fname)
        purgeCache('./build.js')
        require('./build.js')(fname)
    }, 100)
}

fs.watch('./src', {
	persistent: true,
	 recursive: true
}, rebuild)

fs.watch('./build.js', rebuild)

const server = lr.createServer()
server.watch(path.join(__dirname, "dist"))

write_status()
require('./build.js')()