const photo   = "📷"
const video   = "📹"
const wetsuit = "💧"
const watch   = "⌚"
const house   = "🏠"
const strobe  = "⚡"
const torch   = "🔦"
const optics  = "🔎"
const machine = "💻"

const axel_gear   = [
	{ type: photo  , name: 'Canon G7X Mark II'           },
	{ type: house  , name: 'Fantasea FG7XII'             },
	{ type: optics , name: 'Nauticam CMC-1'              },
	{ type: optics , name: 'Fantasea UWL-09F'            },
	{ type: photo  , name: 'Nauticam Flip'               },
	{ type: strobe , name: 'Sea & Sea YS-01 Strobe (2x)' },
	{ type: watch  , name: 'Suunto Zoop Novo'            },
	{ type: wetsuit, name: 'Waterproof W1 (5mm)'         },
	{ type: wetsuit, name: 'Waterproof Boots (5mm)'      },
	{ type: wetsuit, name: 'Fins ???'                    },
	{ type: machine, name: 'MacBook Air (2013)'          },
]

const krille_gear = [
	{ type: photo  , name: 'Sony a6500'                  },
	{ type: house  , name: 'Sea Frogs a6XXX Salted Line' },
	{ type: optics , name: 'Sony 16-50mm Zoom Lens'      },
	{ type: optics , name: 'Sony 90mm Macro Lens'        },
	{ type: optics , name: 'Nauticam CMC-1'              },
	{ type: strobe , name: 'Sea & Sea YS-01 Strobe'      },
	{ type: watch  , name: 'Suunto Zoop Novo'            },
	{ type: wetsuit, name: 'Waterproof W1 (5mm)'         },
	{ type: wetsuit, name: 'Waterproof Boots (5mm)'      },
	{ type: wetsuit, name: 'Fins ???'                    },
	{ type: video  , name: 'Olympus TG-Tracker'          },

]

const carro_gear = [
	{ type: watch  , name: 'Suunto Zoop Novo'},
	{ type: wetsuit, name: 'Mares ?? (7mm)'  },
	{ type: wetsuit, name: 'Fins ???' },
]

const content = `
<div class="gear-list">
	${build_list('Axel', axel_gear)}
	${build_list('Kristoffer', krille_gear)}
	${build_list('Caroline', carro_gear)}
</div>
`

function build_list(name, list) {
	const gear = list.map(equipment => `
<li>
	<span>${equipment.type}</span>
	<p>${equipment.name}</p>
</li>`)
	return `
	<section>
		<h2>${name}</h2>
		<ul>${gear.join('\n')}</ul>
	</section>`
}

module.exports = function(output) {
	require('layout')(output, 'Gear', 'Equipment', content)
}