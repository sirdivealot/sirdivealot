const content = `<p>Comin' at ya' with nudies and shrimps.</p>`
module.exports = function(output) {
	require('layout')(output, 'Home', 'We Are Live!', content)
}