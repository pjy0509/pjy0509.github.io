import Utils from "./utils.js";

const Modal = {
	el: {},
	shown: [],
	init: function () {
		window.Modal = Modal;
		
		history.pushState(null, null, document.URL);
		
		window.addEventListener("popstate", () => {
			if (Modal.shown.length > 0) {
				Utils.clearHash();
				Modal.shown.pop().classList.remove("show");
			}
		});
	},
	show: function (id) {
		const modal = Modal.getModalById(id);
		const modalContent = modal.querySelector("div");
		const scrollElement = Utils.getSimpleBarScrollElement(modalContent);
		
		modal.classList.add("show");
		modal.style.zIndex = (Modal.shown.length + 999).toString();
		
		scrollElement.addEventListener("scroll", () => {
			modal.dataset.scrollY = scrollElement.scrollTop.toString();
		});
		
		void document.documentElement.offsetHeight;
		
		Utils.recordScrollY();
		
		this.shown.push(modal);
	},
	hide: function (id) {
		const modal = Modal.getModalById(id);
		const index = Modal.shown.indexOf(modal);
		
		modal.classList.remove("show");
		modal.style.zIndex = "0";
		
		Utils.clearHash();
		
		this.shown.splice(index, 1);
	},
	getModalById: function (id) {
		id = id instanceof HTMLElement
			? id.closest("[data-modal-id]").dataset.modalId
			: id;
		
		if (Modal.el[id] !== undefined) {
			return Modal.el[id];
		}
		
		const modal = document.querySelector("[data-modal-id=" + id + "]");
		const modalContent = modal.querySelector("div");
		const modalClose = modal.querySelector("button.modal-close");
		
		modal.onclick = function () {
			Modal.hide(this);
		}
		
		modalClose.onclick = function () {
			Modal.hide(this);
		}
		
		modalContent.onclick = function () {
			event.stopPropagation();
		}
		
		Modal.el[id] = modal;
		
		return modal;
	}
};

export default Modal;
