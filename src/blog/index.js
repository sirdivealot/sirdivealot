const path = require('path')

const posts = [
	require('./sipadan.js').metadata,
	require('./howto.js').metadata,
]

const content = `
<ul>
	${posts.map(build_post).join('\n')}
</ul>
`

function build_post(post) {
	return `<li>
	<a href="${path.join(process.env.dir, post.anchor)}">
		${post.title}</a>
	<span>(${post.date})</span>
</li>`
}

module.exports = function(output) {
	require('layout')(output, 'Blog', 'Visual Splendor', content)
}