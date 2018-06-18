function fade_in(evt) {
	this.classList.remove('faded')
}

function load_section(section_div) {
	var images = section_div.querySelectorAll('img')
	for (var i = 0; i < images.length; i++) {
		var image = images[i]
		image.classList.add('faded')
		image.src = image.dataset.src
		image.onload = fade_in
	}
}

function load_btn_click(evt) {
	var section_div = this.parentNode
	while (!section_div.classList.contains('gallery'))
		section_div = section_div.parentNode
	load_section(section_div)
	this.parentNode.removeChild(this)
}

window.addEventListener('load', function () {
	var loaders = document.querySelectorAll('.gallery button.load')
	for (var i = 0; i < loaders.length; i++)
		loaders[i].addEventListener('click', load_btn_click, false)
})