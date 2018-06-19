const metadata = {
	 title: 'Sipadan is Life',
	  date: "2018-06-17",
	anchor: '/blog/sipadan.html',
}

const content = `
<p>Writing some more very feel text!</p>
`

module.exports = function(output) {
	require('layout')(output, 'Blog', 'Sipadan', content)
}

module.exports.metadata = metadata
