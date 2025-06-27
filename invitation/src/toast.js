const Toast = {
	el: null,
	shown: [],
	options: {
	
	},
	init: function (options = { autoRemove: 3000, max: 3 }) {
		window.Toast = Toast;
		
		const container = document.createElement("div");
		
		container.dataset.toastContainer = "";
		
		document.body.append(container);
		
		Toast.el = container;
		Toast.options = options;
	},
	show: function (message, type) {
		const toast = document.createElement('div');
		
		toast.innerHTML = message;
		
		if (type) {
			toast.dataset.type = type;
		}
		
		Toast.el.appendChild(toast);
		Toast.shown.unshift(toast);
		
		void toast.offsetWidth;
		
		toast.classList.add("show");
		
		if (Toast.shown.length > Toast.options.max) {
			remove(Toast.shown.pop());
		}
		
		updateToastStyles();
		
		setTimeout(() => {
			remove(toast, true);
		}, Toast.options.autoRemove);
		
		toast.onclick = () => {
			remove(toast, true);
		};
	}
};

function remove(el, updateShown) {
	el.classList.remove("show");
	
	if (updateShown) {
		Toast.shown = Toast.shown.filter(t => t !== el);
		
		remove(el);
	}
	
	setTimeout(() => {
		el.remove();
		updateToastStyles();
	}, 300);
}

function updateToastStyles() {
	Toast.shown.forEach((el, i) => {
		el.style.zIndex = (10 - i).toString();
		el.style.transform = "translateY(" + (-i * 12) + "px) scale(" + (1 - i * 0.05) + ") translateZ(-" + (i * 20) + "px)";
	});
}

export default Toast;
