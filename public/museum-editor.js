function Editor() {
	editor = this
	this.authorsEl = $("#authors")

	$("#createPictureForm").submit(function (event) {
		event.preventDefault()

		data = $(this).serializeArray()

		for (let paramI in data) {
			let param = data[paramI]
			if (param.name == 'created') {
				param.value = param.value + "-01-01"
			}
		}

		console.log($("#picture"))
		let file = $("#picture")[0].files[0]
		var fr = new FileReader();
		fr.onload = function (e) {
			data.push({name: 'picture', value: btoa(fr.result)})
			$.ajax({
				type: "POST",
				url: "/drawings",
				data: data,
				success: (response) => {
					console.log(response)
					editor.alert(response.message)
					$("#createPictureForm").trigger("reset")
				},
				error: function(jqXHR, textStatus, errorThrown) {
					editor.alert(jqXHR.responseJSON.message, 1)
				},
			})
		}
		fr.readAsBinaryString(file)
	})

	$("#createAuthorForm").submit(function (event) {
		event.preventDefault()

		data = $("#createAuthorForm").serialize()
		$.post(
			"/authors", data, (response) => {
				editor.alert(response.message)
				$("#createAuthor").modal('hide')
				editor.updateAuthors()
		})
		.fail(function(jqXHR) {
			editor.alert(jqXHR.responseJSON.message, 1)
		})
	})

	$("#createAuthor").on('hidden.bs.modal', function (e) {
		$("#createAuthorForm").trigger("reset")
	})

	$("#createAuthorSubmit").click(function (event) {
		$("#createAuthorForm").submit()
	})
}

Editor.prototype.updateAuthors = function(selectedId) {
	editor = this
	$.get(
		"/authors", null, (data) => {
			editor.authorsEl.empty()
			if (selectedId == null) {
				editor.authorsEl.append($(`<option disabled selected>Select an author</option>`))
			}

			data.forEach((author) => {
				editor.authorsEl.append($(`<option value="${author.author_id}">${author.name}</option>`))
				console.log(author)
			})
		})
}

Editor.prototype.alert = function(message, error) {
	let alertEl = $("#alertSuccess")
	if (error) {
		alertEl = $("#alertError")
	}

	alertEl.find(".message").text(message)
	alertEl.removeClass("visually-hidden")
	console.log(message)
}

$(document).ready(() => {
	let editor = new Editor()
	editor.updateAuthors()
})
