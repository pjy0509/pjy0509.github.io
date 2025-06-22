const Modal = {
	el: {},
	shown: [],
	init: function () {
		window.Modal = Modal;
		
		history.pushState(null, null, document.URL);
		
		window.addEventListener("popstate", function () {
			if (Modal.shown.length > 1) {
				history.pushState(null, null, document.URL);
				Modal.shown.pop().classList.remove("show");
			}
		});
	},
	show: function (id) {
		const modal = Modal.getModalById(id);
		
		modal.classList.add("show");
		
		this.shown.push(modal);
	},
	hide: function (id) {
		const modal = Modal.getModalById(id);
		const index = Modal.shown.indexOf(modal);
		
		modal.classList.remove("show");
		
		this.shown.splice(index, 1);
	},
	getModalById: function (id) {
		return this.el[id] !== undefined
			? this.el[id]
			: id instanceof HTMLElement
				? id.closest("[data-modal-id]")
				: document.querySelector("[data-modal-id=" + id + "]");
	}
};

export default Modal;
