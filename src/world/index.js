const content = `
	<div class="container">
		<div class="content">
			<h1>We Are Live!</h1>
			<span class="right">2018-06-17</span>
			<p>Comin' at ya' with nudies and shrimps.</p>
		</div>
	</div>
`
module.exports = function(output, dst) {
	require('partials/header')(output)
	output.write('<body>')
	require('partials/jumbo')(output)
	require('partials/nav')(output, 'World')
	output.write(content)
	output.write('</body>')
	require('partials/footer')(output)
}