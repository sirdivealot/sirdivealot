const content = `
<p>Someday we will have been everywhere</p>
`
module.exports = function(output) {
	require('layout')(output, 'World', 'Dive the World!', content)
}
