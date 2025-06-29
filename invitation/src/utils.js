import {tsParticles} from "https://cdn.jsdelivr.net/npm/@tsparticles/engine@3.1.0/+esm";
import {loadAll} from "https://cdn.jsdelivr.net/npm/@tsparticles/all@3.1.0/+esm";

const Utils = {
	init: function () {
		window.Utils = Utils;
		
		const userAgent = navigator.userAgent;
		
		// OS
		document.documentElement.dataset.osName = Native.OS.name;
		
		// WebView
		if (/KAKAOTALK\/(\d*\.)*\d* \(INAPP\)/.test(userAgent)) document.documentElement.dataset.wv = "kakao";
		
		// Color Scheme
		observeColorScheme();
		setThemeColor();
		
		// Particle
		loadParticles();
	},
	on: function (fn, eventTarget, type, delay) {
		let timer = null;
		
		function onTrigger() {
			if (delay !== undefined) {
				clearTimeout(timer);
				timer = setTimeout(fn, delay);
			} else {
				fn();
			}
		}
		
		eventTarget.addEventListener(type, onTrigger);
		
		return function () {
			eventTarget.removeEventListener(type, onTrigger);
		}
	},
	runAndOn: function (fn, eventTarget, type, delay) {
		fn();
		
		return Utils.on(fn, eventTarget, type, delay);
	},
	getSimpleBarScrollElement: function (el) {
		return SimpleBar.instances.get(el).getScrollElement();
	},
	scrollToTop: function () {
		const scrollEl = Utils.getSimpleBarScrollElement(document.body);
		
		scrollEl.scrollTo({top: 0, behavior: 'smooth'});
	},
	scrollToBottom: function () {
		const scrollEl = Utils.getSimpleBarScrollElement(document.body);
		
		scrollEl.scrollTo({top: scrollEl.scrollHeight, behavior: 'smooth'});
	},
	syncScrollY: function (removeHash = false) {
		const y = +location.hash.split("#")[1];
		
		if (!isNaN(y)) Utils.getSimpleBarScrollElement(document.body).scrollTo(0, y);
		if (removeHash) Utils.clearHash();
	},
	recordScrollY: function () {
		history.pushState(null, null, location.protocol + "//" + location.host + location.pathname + location.search + "#" + Utils.getSimpleBarScrollElement(document.body).scrollTop);
	},
	clearHash: function () {
		history.replaceState(null, null, location.protocol + "//" + location.host + location.pathname + location.search);
	},
	copy: function (value) {
		if (navigator.clipboard !== undefined) return navigator.clipboard.writeText(value);
		
		const textarea = document.createElement("textarea");
		
		textarea.value = value;
		textarea.style.top = "0";
		textarea.style.left = "0";
		textarea.style.position = "fixed";
		
		document.body.appendChild(textarea);
		
		textarea.focus();
		textarea.select();
		textarea.setSelectionRange(0, 99999);
		try {
			document.execCommand("copy");
		} catch (err) {
			return Promise.reject();
		}
		
		textarea.setSelectionRange(0, 0);
		
		document.body.removeChild(textarea);
		
		return Promise.resolve();
	}
};

// PARTICLE BEGIN
async function loadParticles() {
	await tsParticles.addShape("blurredImage", {
		init: async (container) => {
			const imageOptions = container.actualOptions.particles.shape.options?.image || [];
			
			container.images = await Promise.all(
				imageOptions.map(({src}) =>
					new Promise(resolve => {
						const img = new Image();
						
						img.src = src;
						img.onload = () => resolve(img);
					})
				)
			);
		},
		draw: ({context, particle, radius}) => {
			const img = particle.container.images[particle.imageIndex];
			const blur = particle.blur || 0;
			
			context.save();
			context.filter = `blur(${blur}px)`;
			context.drawImage(img, -radius, -radius, radius * 2, radius * 2);
			context.restore();
		},
		particleInit: (container, particle) => {
			const blurOpt = container.actualOptions.particles.shape.options?.blur || {min: 0, max: 5};
			const blurMin = blurOpt.min;
			const blurMax = blurOpt.max;
			const blur = Math.floor(Math.random() * (blurMax - blurMin + 1)) + blurMin;
			
			particle.imageIndex = Math.floor(Math.random() * container.images.length);
			particle.blur = blur;
		},
	});
	
	await loadAll(tsParticles);
	await tsParticles.load(
		{
			id: "tsparticles",
			options: {
				detectRetina: true,
				fpsLimit: 60,
				fullScreen: {
					enable: false,
				},
				particles: {
					number: {
						value: 130,
						limit: {
							mode: "delete",
							value: 0
						},
						density: {
							enable: true,
							width: 1920,
							height: 1080
						}
					},
					shape: {
						type: "blurredImage",
						options: {
							image: [
								{src: "./assets/images/particle/particle1.png"},
								{src: "./assets/images/particle/particle2.png"},
								{src: "./assets/images/particle/particle3.png"},
								// {src: "./assets/images/particle/particle4.png"},
								{src: "./assets/images/particle/particle5.png"},
								{src: "./assets/images/particle/particle6.png"},
								// {src: "./assets/images/particle/particle7.png"},
							],
							blur: {
								min: 0,
								max: 0
							}
						},
					},
					size: {
						value: {
							min: 4,
							max: 6
						}
					},
					rotate: {
						value: {
							min: 180,
							max: 360
						},
						animation: {
							enable: true,
							speed: 45,
							sync: false
						},
						direction: "random",
						path: false
					},
					reduceDuplicates: false,
					opacity: {
						value: 1
					},
					move: {
						angle: {
							offset: 0,
							value: 90
						},
						center: {
							x: 50,
							y: 50,
							mode: "percent",
							radius: 0
						},
						direction: "bottom-left",
						enable: true,
						size: true,
						speed: {
							min: 1,
							max: 4
						},
					},
					effect: {
						close: true,
						fill: true,
						options: {},
						type: []
					},
				},
			}
		}
	);
}
// PARTICLE END

// COLOR BEGIN
function observeColorScheme() {
	function detectColorScheme() {
		new Promise(resolve => {
			if (navigator.userAgent.match(/Samsung/i) || window.matchMedia === undefined) {
				const img = new Image();
				
				img.onload = function () {
					const ctx = document.createElement("canvas").getContext("2d");
					ctx.drawImage(img, 0, 0);
					const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
					resolve((r & b & g) < 255 ? "dark" : "light");
				}
				
				img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IndoaXRlIi8+PC9zdmc+';
			} else {
				resolve(window.matchMedia('(prefers-color-scheme:dark)').matches ? "dark" : "light");
			}
		})
			.then(scheme => document.documentElement.dataset.colorScheme = scheme);
	}
	
	Utils.runAndOn(
		detectColorScheme,
		window.matchMedia("(prefers-color-scheme: dark)"),
		"change"
	);
}

function setThemeColor() {
	const filter = solve(getComputedStyle(document.body).backgroundColor);
	
	document.querySelectorAll("[data-theme-color-image]").forEach(image => {
		image.style.filter = filter;
	});
}

function solve(color) {
	return css(solveNarrow(solveWide(color = parseRgb(color)), color).values);
}

function clamp(value) {
	if (value > 255) {
		value = 255;
	} else if (value < 0) {
		value = 0;
	}
	return value;
}

function hsl(color) {
	const r = color.r / 255;
	const g = color.g / 255;
	const b = color.b / 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h, s, l = (max + min) / 2;
	
	if (max === min) {
		h = s = 0;
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			
			case g:
				h = (b - r) / d + 2;
				break;
			
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}
	
	return {
		h: h * 100,
		s: s * 100,
		l: l * 100,
	};
}

function invert(value, color) {
	color.r = clamp((value + color.r / 255 * (1 - 2 * value)) * 255);
	color.g = clamp((value + color.g / 255 * (1 - 2 * value)) * 255);
	color.b = clamp((value + color.b / 255 * (1 - 2 * value)) * 255);
}

function linear(slope, intercept = 0, color) {
	color.r = clamp(color.r * slope + intercept * 255);
	color.g = clamp(color.g * slope + intercept * 255);
	color.b = clamp(color.b * slope + intercept * 255);
}

function brightness(value, color) {
	linear(value, 0, color);
}

function contrast(value, color) {
	linear(value, -(0.5 * value) + 0.5, color);
}

function multiply(matrix, color) {
	const newR = clamp(color.r * matrix[0] + color.g * matrix[1] + color.b * matrix[2]);
	const newG = clamp(color.r * matrix[3] + color.g * matrix[4] + color.b * matrix[5]);
	const newB = clamp(color.r * matrix[6] + color.g * matrix[7] + color.b * matrix[8]);
	color.r = newR;
	color.g = newG;
	color.b = newB;
}

function saturate(value, color) {
	multiply([
		0.213 + 0.787 * value,
		0.715 - 0.715 * value,
		0.072 - 0.072 * value,
		0.213 - 0.213 * value,
		0.715 + 0.285 * value,
		0.072 - 0.072 * value,
		0.213 - 0.213 * value,
		0.715 - 0.715 * value,
		0.072 + 0.928 * value,
	], color);
}

function sepia(value, color) {
	multiply([
		0.393 + 0.607 * (1 - value),
		0.769 - 0.769 * (1 - value),
		0.189 - 0.189 * (1 - value),
		0.349 - 0.349 * (1 - value),
		0.686 + 0.314 * (1 - value),
		0.168 - 0.168 * (1 - value),
		0.272 - 0.272 * (1 - value),
		0.534 - 0.534 * (1 - value),
		0.131 + 0.869 * (1 - value),
	], color);
}

function hueRotate(angle, color) {
	angle = angle / 180 * Math.PI;
	const sin = Math.sin(angle);
	const cos = Math.cos(angle);
	
	multiply([
		0.213 + cos * 0.787 - sin * 0.213,
		0.715 - cos * 0.715 - sin * 0.715,
		0.072 - cos * 0.072 + sin * 0.928,
		0.213 - cos * 0.213 + sin * 0.143,
		0.715 + cos * 0.285 + sin * 0.140,
		0.072 - cos * 0.072 - sin * 0.283,
		0.213 - cos * 0.213 - sin * 0.787,
		0.715 - cos * 0.715 + sin * 0.715,
		0.072 + cos * 0.928 + sin * 0.072,
	], color);
}

function grayscale(value, color) {
	multiply([
		0.2126 + 0.7874 * (1 - value),
		0.7152 - 0.7152 * (1 - value),
		0.0722 - 0.0722 * (1 - value),
		0.2126 - 0.2126 * (1 - value),
		0.7152 + 0.2848 * (1 - value),
		0.0722 - 0.0722 * (1 - value),
		0.2126 - 0.2126 * (1 - value),
		0.7152 - 0.7152 * (1 - value),
		0.0722 + 0.9278 * (1 - value),
	], color);
}

function css(filters) {
	return "invert(" + fmt(filters, 0, 1) + "%) "
		+ "sepia(" + fmt(filters, 1, 1) + "%) "
		+ "saturate(" + fmt(filters, 2, 1) + "%) "
		+ "hue-rotate(" + fmt(filters, 3, 3.6) + "deg) "
		+ "brightness(" + fmt(filters, 4, 0.9) + "%) "
		+ "contrast(" + fmt(filters, 5, 1) + "%)"
}

function fmt(filters, idx, multiplier) {
	return Math.round(filters[idx] * multiplier);
}

function solveNarrow(wide, color) {
	const A = wide.loss;
	const c = 2;
	const A1 = A + 1;
	const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
	return spsa(A, a, c, wide.values, 500, color);
}

function solveWide(color) {
	const A = 5;
	const c = 15;
	const a = [60, 180, 18000, 600, 1.2, 1.2];
	
	let best = {loss: Infinity};
	for (let i = 0; best.loss > 25 && i < 3; i++) {
		const initial = [50, 20, 3750, 50, 100, 100];
		const result = spsa(A, a, c, initial, 1000, color);
		if (result.loss < best.loss) {
			best = result;
		}
	}
	return best;
}

function spsa(A, a, c, values, iters, color) {
	const alpha = 1;
	const gamma = 0.16666666666666666;
	
	let best = null;
	let bestLoss = Infinity;
	const deltas = new Array(6);
	const highArgs = new Array(6);
	const lowArgs = new Array(6);
	
	for (let k = 0; k < iters; k++) {
		const ck = c / Math.pow(k + 1, gamma);
		for (let i = 0; i < 6; i++) {
			deltas[i] = Math.random() > 0.5 ? 1 : -1;
			highArgs[i] = values[i] + ck * deltas[i];
			lowArgs[i] = values[i] - ck * deltas[i];
		}
		
		const lossDiff = loss(highArgs, color) - loss(lowArgs, color);
		for (let i = 0; i < 6; i++) {
			const g = lossDiff / (2 * ck) * deltas[i];
			const ak = a[i] / Math.pow(A + k + 1, alpha);
			values[i] = fix(values[i] - ak * g, i);
		}
		
		const l = loss(values, color);
		if (l < bestLoss) {
			best = values.slice(0);
			bestLoss = l;
		}
	}
	return {values: best, loss: bestLoss};
	
	function fix(value, idx) {
		let max = 100;
		if (idx === 2 /* saturate */) {
			max = 7500;
		} else if (idx === 4 /* brightness */ || idx === 5 /* contrast */) {
			max = 200;
		}
		
		if (idx === 3 /* hue-rotate */) {
			if (value > max) {
				value %= max;
			} else if (value < 0) {
				value = max + value % max;
			}
		} else if (value < 0) {
			value = 0;
		} else if (value > max) {
			value = max;
		}
		return value;
	}
}

function loss(filters, color) {
	const black = {r: 0, g: 0, b: 0};
	const targetHSL = hsl(color);
	
	invert(filters[0] / 100, black);
	sepia(filters[1] / 100, black);
	saturate(filters[2] / 100, black);
	hueRotate(filters[3] * 3.6, black);
	brightness(filters[4] / 100, black);
	contrast(filters[5] / 100, black);
	
	const colorHSL = hsl(black);
	
	return (
		Math.abs(color.r - color.r) +
		Math.abs(color.g - color.g) +
		Math.abs(color.b - color.b) +
		Math.abs(colorHSL.h - targetHSL.h) +
		Math.abs(colorHSL.s - targetHSL.s) +
		Math.abs(colorHSL.l - targetHSL.l)
	);
}

function parseRgb(hex) {
	const result = /^rgba?\((\d{1,3})(?:,\s?|\s)(\d{1,3})(?:,\s?|\s)(\d{1,3}).*\)/.exec(hex);
	
	return result
		? {
			r: +result[1],
			g: +result[2],
			b: +result[3]
		}
		: null;
}
// COLOR END

export default Utils;
