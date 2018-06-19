const metadata = {
	 title: 'Mabul / Kapalai / Sipadan',
	  date: "2017",
	 range: 21,
	 dives: 57,
	anchor: '/dives/mabul17.html',
}

const path = require('path')
const fs   = require('fs')

var folders = [
	'day1' , 'day2' , 'day3'        , 'day4' , 'day5' ,
	'day6' , 'day7' , 'day8'        , 'day9' , 'day10',
	'day11', 'day14', 'day15'       , 'day16', 'day17',
	'day18', 'day19', 'night-dive-2', 'sipadan-4'
]

const content = `
<p>In the summer of 2017 we set sail to the east coast of Borneo,
Malaysia. After an ardous flight across the globe we found ourselves
in the town of Tawau, a few kilometers away from our destination
- Mabul. After an exciting journey through the <strike>jungle</strike> beautiful
landscape we were dropped off in the middle of Semporna and immediately went into
the wrong dive shop.</p>

<p>Recognizing our error we headed off onto the streets in the
scorching sun, asking all dive shops along the way if they knew where we our
mystical and, as time went on, increasingly fictional dive shop's office was
located.</p>

<p>When the sun had reached its zenith we finally gave in and made the, in
hindsight, relatively inexpensive international call the way was made clear.
Re-energized by pure hope the now <em>very</em> sweaty trio dragged themselves
towards a complex by the sea known as <strong>Dragon Inn</strong>.</p>

<p>Our untimely arrival was not as disastrous as we—in our dark times on the
road—had feared and we were told that we still would be able to rest on Mabul
Island that same very night. There was, <em>of course</em>, a catch: money up front.
While we had given credit card information by way of photo and email we still
had 50% of our bill to settle. So we were packed into a suspicious-looking vehicle
and driven to the nearest bank. After emptying their ATMs we were shipped back to
the office and handed over stacks upon stacks (upon stacks) of <strong>Ringgit</strong>. After all, <em>“when coin
crosses hands, the way is made clear and passage is given”</em> (Philosophus
Anonymous, 1967). While we were <strike>robbing</strike> emptying the bank, dark clouds had
begun to appear and now, just as we were about to jump aboard the small
speedboat to Mabul, they let loose (like it was 1986).
</p>
<p>As we were fast approaching our destination the sun god fought back against
the dark currents and shone its light on us. While our captain navigated around
the island we started looking for anything resembling the images found on the dive
shop's website. Soon, the words "Noble World Scuba" and "Mabul Backpackers"
appeared on a familiar-looking platform—we had finally arrived!</p>

<p>Our stay on Pulau Mabul was incredible and we met many cool divers! The diving
itself was perfect for a couple of freshly minted cameramen with calm dive sites
full of macro critters. The islanders have a saying: "when in Mabul, you must come
to Sipadan". And boy did we go to Sipadan! We spent 5 full days in this gorgeous
underwater heaven with schools of jacks and barracudas circling overhead, and had
a chat with the friendly neighbourhood reefsharks.
</p>

<p>During our 21 days on Mabul we spent 17 of them mostly in the water (1 day of
end-of-Ramadan festivities and 1 day exploring the island). We have uploaded some
pictures from the world beneath the surface—check them out!
</p>
${folders.map(build_section).join('\n')}
`

function build_section(name) {
	const folder = path.join('/img', 'mabul17', name)
	const fs_path = path.join(__dirname, '..', folder)
	const web_path = path.join(process.env.dir, folder)

	const picts = fs.readdirSync(fs_path).map(picture => {
		const link = path.join(web_path, picture)
		return `<img data-src="${link}"/>`
	}).join('\n')

	const load = `<button class="load">load images</button>`

	return `<section class="gallery">
		<div class="section-header">
			<a name="${name}" href="#${name}">#</a>
			<h2>${name}</h2>
		</div>
		${load}
		${picts}
	</section>`
}

module.exports = function(output) {
	require('layout')(output, 'Dives', metadata.title, content)
}

module.exports.metadata = metadata