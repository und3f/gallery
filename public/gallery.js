function Gallery() {
	editor = this
	this.galleryEl = $("#gallery-listing")
}

Gallery.prototype.updateDrawings = function() {
	let gallery = this

	$.get(
		"/drawings", null, (data) => {
			let gEl = gallery.galleryEl
			gEl.empty()
			gEl.append($(`<ul>`))

			data.forEach((drawing) => {
				gEl.append($(`<li><a href="drawing/${drawing.drawing_id}.html">${drawing.drawing_id}</a>`))
			})
		})
}

$(document).ready(() => {
	let preloader = $("#preloader")
	var doc = $(document);

	$(document).ajaxStart(function(){
		preloader.fadeIn();
	})
	.ajaxComplete(function(){
		// Keep it visible for 0.8 seconds after the request completes
		preloader.delay(0).fadeOut();
	});


	let gallery = new Gallery()
	gallery.updateDrawings()
})
