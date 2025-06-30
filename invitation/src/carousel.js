import PhotoSwipeLightbox from 'https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe-lightbox.esm.js';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';
import Utils from "./utils.js";

const Carousel = {
	photoBox: null,
	swiper: null,
	init: async function () {
		window.Carousel = Carousel;
		
		const images = Array.from({length: 34}, (_, i) => "assets/images/carousel/carousel" + (i + 1) + ".jpg");
		
		const imagePromises = images.map(getImageSize);
		const resolvedImages = await Promise.all(imagePromises);
		
		const swiperSelector = "[data-swiper]";
		const swiperElement = document.querySelector(swiperSelector);
		const swiperContainer = document.createElement("div");
		const swiperTotalElement = document.querySelector("[data-swiper-total]");
		const swiperCurrentElement = document.querySelector("[data-swiper-current]");
		const swiperPrevElement = document.querySelector("[data-swiper-prev]");
		const swiperNextElement = document.querySelector("[data-swiper-next]");
		const length = images.length;
		
		swiperContainer.classList.add("swiper-wrapper");
		
		for (let i = 0; i < length; i++) {
			const imgContainer = document.createElement("div");
			imgContainer.classList.add("swiper-slide");
			
			const img = document.createElement("img");
			img.src = images[i];
			
			imgContainer.append(img);
			swiperContainer.append(imgContainer);
		}
		
		swiperElement.append(swiperContainer);
		swiperTotalElement.textContent = length.toString();
		
		Carousel.swiper = new Swiper("[data-swiper]", {
			loop: true,
		});
		
		Utils.runAndOn(
			() => {
				const children = swiperContainer.children;
				
				for (let i = 0; i < children.length; i++) {
					children[i].style.height = "unset";
				}
				
				Carousel.swiper.update();
				
				void swiperContainer.offsetWidth;
				
				for (let i = 0; i < children.length; i++) {
					children[i].style.height = swiperContainer.offsetHeight + "px";
				}
			},
			window,
			"resize",
			300
		);
		
		swiperCurrentElement.textContent = (Carousel.swiper.realIndex + 1).toString();
		
		Carousel.swiper.on("slideChange", () => {
			swiperCurrentElement.textContent = (Carousel.swiper.realIndex + 1).toString();
		});
		
		swiperPrevElement.onclick = function () {
			Carousel.swiper.slidePrev();
		}
		
		swiperNextElement.onclick = function () {
			Carousel.swiper.slideNext();
		}
		
		function getContainer() {
			const container = document.createElement("div");
			
			container.style.background = "rgb(0 0 0)";
			container.style.width = "100%";
			container.style.height = "100%";
			container.style.display = "none";
			
			document.body.appendChild(container);
			
			return container;
		}
		
		const photoBoxContainer = getContainer();
		const fullscreenAPI = getFullscreenAPI();
		const useFullscreen = fullscreenAPI && Native.OS.name !== "Android" && Native.OS.name !== "iOS";
		let beforeY;
		
		Carousel.photoBox = new PhotoSwipeLightbox({
			dataSource: resolvedImages,
			showHideAnimationType: "fade",
			openPromise: function () {
				return new Promise(resolve => {
					history.pushState(null, null, document.URL);
					
					window.addEventListener("popstate", () => {
						Utils.clearHash();
						Carousel.photoBox.pswp.close();
					});
					
					
					if (!useFullscreen || fullscreenAPI.isFullscreen()) {
						beforeY = window.scrollY;
						
						return resolve();
					}
					
					document.addEventListener(fullscreenAPI.change, function onFullscreenChange() {
						if (fullscreenAPI.isFullscreen()) {
							photoBoxContainer.style.display = 'block';
							
							setTimeout(resolve, 300);
						} else {
							if (screen.orientation && screen.orientation.unlock) {
								screen.orientation.unlock();
							}
							
							document.removeEventListener(fullscreenAPI.change, onFullscreenChange);
							Carousel.photoBox.pswp.close();
						}
					});
					
					fullscreenAPI.request(photoBoxContainer);
				});
			},
			...(useFullscreen ? {appendToEl: photoBoxContainer} : {}),
			bgOpacity: 1,
			showAnimationDuration: 0,
			hideAnimationDuration: 0,
			preloadFirstSlide: false,
			pinchToClose: false,
			closeOnVerticalDrag: false,
			zoom: false,
			arrowPrev: false,
			arrowNext: false,
			pswpModule: () => import("https://unpkg.com/photoswipe"),
		});
		
		Carousel.photoBox.on('close', () => {
			Utils.clearHash();
			
			if (beforeY !== undefined) {
				window.scrollTo(0, beforeY);
			}
			
			photoBoxContainer.style.display = 'none';
			
			if (useFullscreen && fullscreenAPI.isFullscreen()) {
				fullscreenAPI.exit();
			}
		});
		
		Carousel.photoBox.on('change', () => {
			Carousel.swiper.slideToLoop(Carousel.photoBox.pswp.currSlide.index);
		});
		
		Carousel.photoBox.init();
	},
	fullscreen: function () {
		Carousel.photoBox.loadAndOpen(Carousel.swiper.realIndex);
	}
};

function getFullscreenAPI() {
	let api;
	let enterFS;
	let exitFS;
	let elementFS;
	let changeEvent;
	let errorEvent;
	
	if (document.documentElement.requestFullscreen) {
		enterFS = 'requestFullscreen';
		exitFS = 'exitFullscreen';
		elementFS = 'fullscreenElement';
		changeEvent = 'fullscreenchange';
		errorEvent = 'fullscreenerror';
	} else if (document.documentElement.webkitRequestFullscreen) {
		enterFS = 'webkitRequestFullscreen';
		exitFS = 'webkitExitFullscreen';
		elementFS = 'webkitFullscreenElement';
		changeEvent = 'webkitfullscreenchange';
		errorEvent = 'webkitfullscreenerror';
	}
	
	if (enterFS) {
		api = {
			request: function (el) {
				if (enterFS === 'webkitRequestFullscreen') {
					el[enterFS](Element.ALLOW_KEYBOARD_INPUT);
				} else {
					el[enterFS]();
				}
			},
			
			exit: function () {
				return document[exitFS]();
			},
			
			isFullscreen: function () {
				return document[elementFS];
			},
			
			change: changeEvent,
			error: errorEvent
		};
	}
	
	return api;
}

async function getImageSize(src) {
	return new Promise(resolve => {
		const img = new Image();
		img.onload = () => resolve({
			src,
			width: img.naturalWidth,
			height: img.naturalHeight
		});
		img.src = src;
	});
}

export default Carousel;
