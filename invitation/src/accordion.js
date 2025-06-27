import Utils from "./utils.js";

const Accordion = {
	initialized: false,
	init: function (id) {
		window.Accordion = Accordion;
		
		if (id === undefined && Accordion.initialized === false) {
			Accordion.initialized = true;
			
			return Utils.runOnceAndEventTrigger(
				Accordion.init,
				window,
				"resize",
				300
			);
		}
		
		window.requestAnimationFrame(() => {
			if (id === undefined) return document.querySelectorAll("[data-accordion]").forEach(initAccordion);
			else return initAccordion(document.querySelector("[data-accordion=\"" + id + "\"]"));
			
			function initAccordion(accordion) {
				const header = accordion.querySelector("[data-accordion-header]");
				
				if (header !== null) {
					const collapseHeight = getOuterHeight(header);
					
					accordion.classList.add("no-transition");
					accordion.style.maxHeight = collapseHeight + "px";
					accordion.dataset.accordionCollapseHeight = collapseHeight.toString();
					void accordion.offsetHeight;
					accordion.classList.remove("no-transition");
				}
				
				const children = accordion.children;
				let maxHeight = 0;
				
				for (let i = 0; i < children.length; i++) {
					maxHeight += getOuterHeight(children.item(i));
				}
				
				accordion.dataset.accordionExpandHeight = maxHeight.toString();
				
				if (accordion.classList.contains("on")) {
					accordion.classList.add("no-transition");
					accordion.style.maxHeight = accordion.dataset.accordionExpandHeight + "px";
					void accordion.offsetHeight;
					accordion.classList.remove("no-transition");
				}
				
				const button = document.querySelector("[data-accordion-toggle=\"" + accordion.dataset.accordion + "\"]");
				
				if (button !== null) {
					[button, ...document.querySelectorAll("[data-accordion-extra=\"" + accordion.dataset.accordion + "\"]")]
						.forEach(element => {
							element.onclick = event => {
								event.stopPropagation();
								
								if (accordion.classList.contains("on")) {
									accordion.style.maxHeight = accordion.dataset.accordionCollapseHeight + "px";
									accordion.classList.remove("on");
									button.classList.remove("on");
								} else {
									accordion.style.maxHeight = accordion.dataset.accordionExpandHeight + "px";
									accordion.classList.add("on");
									button.classList.add("on");
								}
							}
						});
				}
			}
		})
	},
};

function getOuterHeight(element) {
	const style = window.getComputedStyle(element);
	
	return element.clientHeight
		+ +style.marginTop.replace(/px$/, "")
		+ +style.marginBottom.replace(/px$/, "");
}

export default Accordion;
