const Carousel = {
	init: function (fullscreen = false) {
		window.Carousel = Carousel;
		
		const glide = document.querySelector("[data-glide]");
		let track = glide.querySelector("[data-glide-el=\"track\"]");
		
		if (fullscreen) {
			track.onclick = undefined;
			document.querySelector("[data-fullscreen=\"carousel\"]").append(glide);
		}
		
		const carousel = new Glide(".item-carousel", {
			type: "carousel",
			perView: 1,
			gap: 16,
			autoplay: 0,
			hoverpause: true,
			animationDuration: 200,
		})
			.mount();
		
		const current = document.getElementById("carousel-current");
		const total = document.getElementById("carousel-total");
		
		total.textContent = carousel._c.Html.slides.length.toString();
		current.textContent = (carousel.index + 1).toString();
		
		carousel.on("move", function () {
			current.textContent = (carousel.index + 1).toString();
		});
		
		if (fullscreen) {
			let images;
			
			track = document.querySelector("[data-glide] [data-glide-el=\"track\"]");
			
			carousel.on("move.after", function () {
				images = track.querySelectorAll("[data-image-index=\"" + carousel.index + "\"]");
			});
			
			EventManager.on(glide, ['touchpinchmove'], e => {
				const dp = e.paths.slice(-2);
				
				if (dp.length < 2) return;
				
				const dd = dp.reduce((curr, prev) => curr.distance - prev.distance);
				const dx = dp.reduce((curr, prev) => curr.center.x - prev.center.x);
				const dy = dp.reduce((curr, prev) => curr.center.y - prev.center.y);
				
				images.forEach(image => {
					const scale = image.style.scale;
					const transform = image.style.transform;
					const px = transform.indexOf("px");
					const py = transform.lastIndexOf("px");
					
					image.style.scale = Math.max(0.33, Math.min(3, scale - dd / 125)).toString();
					image.style.transform = "translate(" + (Number(transform.substring(10, px)) - dx * 1.25) + "px, " + (Number(transform.substring(px + 3, py)) - dy * 1.25) + "px)"
				});
			});
			
			EventManager.on(glide, ['touchpinchstart'], () => {
				carousel.disable();
			});
			
			EventManager.on(glide, ['touchpinchend'], () => {
				images.forEach(image => {
					image.style.scale = "1";
					image.style.transform = "translate(0px, 0px)";
				});
				
				carousel.enable();
				carousel.update({animationDuration: 0});
				carousel.go("=" + carousel.index);
				carousel.update({animationDuration: 200});
				setTimeout(() => {
					carousel.enable();
					carousel.update({animationDuration: 0});
					carousel.go("=" + carousel.index);
					carousel.update({animationDuration: 200});
				});
			});
			
		}
		
		return carousel;
	},
	fullscreen: function () {
		location.href = location.origin + location.pathname + "?mode=carousel";
	}
};

export default Carousel;
