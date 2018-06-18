const path = require('path')

const trips = [
	require('./tulamben18.js').metadata,
	require('./weh18.js').metadata     ,
	require('./mabul17.js').metadata   ,
]

const sum = (a,b) => a + b
const ndives = trips.map(trip => trip.dives).reduce(sum, 0)
const ndays  = trips.map(trip => trip.range).reduce(sum, 0)

const content = `
<p>All our dive trips in one place.</p>
<p>We have spent ${ndays} days abroad and made a grand total of ${ndives} dives!</p>

<ul>
	${trips.map(build_trip).join('\n')}
</ul>
`

function build_trip(trip) {
	return `<li>
	<a href="${path.join(process.env.dir, trip.anchor)}">${trip.title}</a>
	<span>${trip.range} days, ${trip.dives} dives</span>
	<span>(${trip.date})</span>
</li>`
}

module.exports = function(output) {
	require('layout')(output, 'Dives', 'Dive Trips', content)
}