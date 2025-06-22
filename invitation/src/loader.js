const Loader = {
	el: null,
	init: function () {
		window.Loader = Loader;
		
		this.el = document.querySelector("[data-loader]");
	},
	show: function () {
		this.el.dataset.loader = "true";
	},
	hide: function () {
		this.el.dataset.loader = "false";
	},
};

export default Loader;
