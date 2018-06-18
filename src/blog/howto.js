const metadata = {
	 title: 'How to: Plan a divetrip!',
	  date: "2018-06-17",
	anchor: '/blog/howto.html',
}

const video = `<iframe width="100%" height="500px" src="https://www.youtube.com/embed/cXFC7biDHT0?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`

const content = `
<p>A <strike>cringey</strike> cool dive video made by yours truly with footage
from Tulamben, Bali.</p>
${video}
<p>// Kristoffer</p>
`

module.exports = function(output) {
	require('layout')(output, 'Blog', metadata.title, content)
}

module.exports.metadata = metadata