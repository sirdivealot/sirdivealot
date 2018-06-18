const metadata = {
	 title: 'Sipadan is Life',
	  date: "2018-06-17",
	anchor: '/blog/sipadan.html',
}

module.exports = function(output) {
	require('layout')(output, 'Blog', 'Sipadan', 'sipadan!')
}

module.exports.metadata = metadata