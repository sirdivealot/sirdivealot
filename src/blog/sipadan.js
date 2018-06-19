const metadata = {
	 title: 'Sipadan is Life',
	  date: "2018-06-17",
	anchor: '/blog/sipadan.html',
}

const content = `
<p>Sipadan is life; sipadan is feel;</p>
`

module.exports = function(output) {
	require('layout')(output, 'Blog', 'Sipadan', content)
}

module.exports.metadata = metadata
