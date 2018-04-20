import { isUndefined } from './general';

export function hasClass(element, className) {
	if (element instanceof HTMLElement && typeof className === 'string') {
		return element.classList.contains(className);
	}
	throw new Error(
		'The element passed in to hasClass is not a valid HTML element'
	);
}

export function addClass(element, className) {
	if (element instanceof HTMLElement && typeof className === 'string') {
		element.classList.add(className);
		return true;
	}
	throw new Error(
		'The element passed in to addClass is not a valid HTML element'
	);
}

export function removeClass(element, className) {
	if (element instanceof HTMLElement && typeof className === 'string') {
		element.classList.remove(className);
		return true;
	}
	throw new Error(
		'The element passed in to removeClass is not a valid HTML element'
	);
}

export function getElement(context, target) {
	return (context || document).querySelector(target);
}

export function getDistanceFromTopOfDocument() {
	return !isUndefined(window.pageYOffset) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
}

export function isInViewport(element) {
	if (element instanceof HTMLElement) {
		var elementPosition = element.getBoundingClientRect().top;
		var screenMiddle = window.innerHeight / 2;

		return elementPosition <= screenMiddle;
	}
	throw new Error(
		'The element passed in to isInViewport is not a valid HTML element'
	);
}

export function getOffsetTop(elem) {
	var offsetTop = 0;
	do {
		if (!isNaN(elem.offsetTop)) {
			offsetTop += elem.offsetTop;
		}
	} while (elem == elem.offsetParent);
	return offsetTop;
}

export function dispatchEvent(evt, data) {
	var event = document.createEvent('Event');
	event.initEvent(evt, true, true);

	if (typeof data !== 'undefined') {
		Object.keys(data).forEach(p => {
			event[p] = data[p];
		});
	}

	window.dispatchEvent(event);
}

export function preventEventDefault(evt) {
	if (evt.preventDefault) {
		evt.preventDefault();
	} else {
		evt.returnValue = false;
	}
}

export function doesElementExist(element) {
	return document.querySelector(element);
}

export function setAttributes(elem, attr) {
	for (let key in attr) {
		elem.setAttribute(key, attr[key]);
	}
}

/*
	EXAMPLE:

	createElement({element: 'div', class: 'className', content: false});
*/

export function createElement(obj) {
	if (typeof obj !== 'object') {
		throw new Error(
			"createElement expects a config object passed in to define the element's properties"
		);
	}
	var newElem = document.createElement(obj.element);
	newElem.setAttribute('class', obj.class);
	if (obj.content !== false) {
		newElem.innerHTML = obj.content;
	}
	return newElem;
}

export function insertBefore(elem, parent, before) {
	var elemNode;
	var parentNode;
	var beforeNode;

	// Check element is a HTML element, if it is a string then query it. Otherwise set it as null.
	if (elem instanceof HTMLElement) {
		elemNode = elem;
	} else {
		elemNode = null;
	}

	// Check parent is a HTML element, if it is a string then query it. Otherwise set it as null.
	if (parent instanceof HTMLElement) {
		parentNode = parent;
	} else if (typeof parent === 'string') {
		parentNode = document.querySelector(parent);
	} else {
		parentNode = null;
	}

	// Null will append it to the end of parents childnodes.
	if (before instanceof HTMLElement) {
		beforeNode = before;
	} else {
		beforeNode = null;
	}

	// Only insert element if parentNode and elementNode are HTML nodes.
	if (parentNode !== null && elemNode !== null) {
		parentNode.insertBefore(elem, before);
		return true;
	}
	throw new Error(
		'insertBefore expects a valid element, parent and before target'
	);
}

export function appendTo(elem, parent) {
	var parentNode;

	// Check parent is a HTML element, if it is a string then query it. Otherwise set it as null.
	if (parent instanceof HTMLElement) {
		parentNode = parent;
	} else if (typeof parent === 'string') {
		parentNode = document.querySelector(parent);
	} else {
		parentNode = null;
	}

	if (parentNode !== null && elem instanceof HTMLElement) {
		parentNode.appendChild(elem);
		return true;
	}
	throw new Error('appendTo expects a valid element and parent');
}

export function setStyles(element, styles) {
	Object.keys(styles).forEach(function(item) {
		element.style[item] = styles[item];
	});
}

export function getElementStyle(el, prop) {
	if (!isUndefined(window.getComputedStyle)) {
		return window.getComputedStyle(el, null).getPropertyValue(prop);
	}
	return el.currentStyle[convertCSSRuleToJs(prop)];
}

export function convertCSSRuleToJs(prop) {
	if (prop.indexOf('-') > -1) {
		// remove any hyphens and capitalise the following letter
		for (var i = 0, len = prop.match(/\-/g).length; i < len; i++) {
			var index = prop.indexOf('-');
			prop =
				prop.substr(0, index) +
				prop[index + 1].toUpperCase() +
				prop.substr(index + 2, prop.length);
		}
	}

	if (prop.indexOf('Ms') === 0) {
		// IE9 fix
		prop = prop[0].toLowerCase() + prop.substr(1);
	}
	return prop;
}

export function cssTransformSupport() {
	if (!window.getComputedStyle) {
		return false;
	}
	var div = document.createElement('div'),
		has3D = {};

	has3D.support = false;

	var transforms = {
		webkitTransform: '-webkit-transform',
		OTransform: '-o-transform',
		msTransform: '-ms-transform',
		MozTransform: '-moz-transform',
		transform: 'transform'
	};

	document.body.insertBefore(div, null);

	for (var t in transforms) {
		if (!isUndefined(div.style[t])) {
			div.style[t] = 'translate3d(1px, 1px, 1px)';
			has3D.support =
				window.getComputedStyle(div).getPropertyValue(transforms[t]) !== 'none';
			has3D.prefix = transforms[t];
			if (transforms[t].indexOf('webkit') > -1) {
				break;
			}
		}
	}

	document.body.removeChild(div);
	return has3D;
}

export function wrapInStylePosition(options) {
	let {
		galleryTransitionsActive,
		galleryTransformPrefix,
		position,
		convertToJs
	} = options;

	if (convertToJs) {
		galleryTransformPrefix = convertCSSRuleToJs(galleryTransformPrefix);
	}
	let style = {};
	if (galleryTransitionsActive) {
		style[galleryTransformPrefix] = `translate3d(${position}px,0,0)`;
	} else {
		style[galleryTransformPrefix] = `translate(${position}px,0)`;
	}
	return style;
}

export function combineDomElements(arr, parent, styles, append) {
	// if append is false it will prepend.
	if (
		(!(arr instanceof Array) && typeof parent !== 'string') ||
		window.breakpoint.value !== 'mobile'
	) {
		return false;
	}

	var styleStr = '';

	for (var style in styles) {
		styleStr += style + ': ' + styles[style] + '; ';
	}

	var target = document.querySelector(parent);

	arr.forEach(function(item) {
		var clonedItem = document.querySelector(item).cloneNode(true);

		if (styleStr) {
			var currentStyles = clonedItem.getAttribute('style') || '';
			clonedItem.setAttribute('style', currentStyles + styleStr);
		}

		clonedItem.setAttribute('data-cloned', true);

		if (append === true) {
			target.appendChild(clonedItem);
		} else {
			target.insertBefore(clonedItem, target.firstChild);
		}
	});
}

export function removeElement(element) {
	let child =
		element instanceof HTMLElement ? element : document.querySelector(element);
	child.parentNode.removeChild(child);
}

export function removeClonedItems(evt) {
	if (evt.breakpoint !== 'mobile') {
		var clonedItems = document.querySelectorAll('[data-cloned]');

		if (clonedItems) {
			[].forEach.call(clonedItems, function(item) {
				var parent = item.parentNode;
				parent.removeChild(item);
			});
		} else {
			return false;
		}
	}
}

export function getTransitionEndPrefix() {
	var div = document.createElement('div'),
		prefix;

	var prefixes = {
		OTransition: 'oTransitionEnd',
		MozTransition: 'transitionend',
		WebkitTransition: 'webkitTransitionEnd',
		transition: 'transitionend'
	};

	for (var t in prefixes) {
		if (!isUndefined(div.style[t])) {
			prefix = prefixes[t];
			break;
		}
	}

	return prefix;
}

export function getGalleryComponentWidths(gallery) {
	let mediaGalleryWidth = gallery.offsetWidth;
	let mediaGalleryHeight = gallery.offsetHeight;
	let thumbHolder = gallery.querySelector('#galleryThumbs'),
		thumbHolderWidth = 0;
	if (thumbHolder) {
		thumbHolderWidth = thumbHolder.offsetWidth;
	}
	return {
		mediaGalleryWidth,
		mediaGalleryHeight,
		thumbHolderWidth
	};
}

export function getTranslate3dLeftValue(element) {
	return parseInt(
		window
			.getComputedStyle(element)
			.getPropertyValue('transform')
			.match(/(\(.*\))/)[0]
			.split(',')[4]
	);
}

export function AoStyles(element) {
	function getTheElement() {
		return element instanceof HTMLElement ? element : document.querySelector(element).one();
	}

	return {
		get(styles) {
			if (!Array.isArray(styles)) {
				throw new Error('Second parameter of this function should be an array');
			}

			let elem = getTheElement();
			let obj = {};

			if (elem && styles) {
				styles.map(
					style =>
						(obj[style] = window
							.getComputedStyle(elem, null)
							.getPropertyValue(style))
				);
				return obj;
			}
		},

		set(styles) {
			if (typeof styles !== 'object') {
				throw new Error(
					'Second parameter of this function should be an object'
				);
			}

			let elem = getTheElement();

			if (elem & styles) {
				for (let i in styles) {
					elem.style[i] = styles[i];
				}
			}
		}
	};
}

export function getFirstImage() {
	const mediaData = document.getElementById('mediaData');
	if (mediaData) {
		const image = JSON.parse(mediaData.innerHTML).images ? JSON.parse(mediaData.innerHTML).images[0].large : false;
	}
	return mediaData;
}

export function getImageSize(size = 'thumb') {
	let firstImage = JSON.parse(mediaData.innerHTML).images[0][size];
	return firstImage;
}

export function setImageSrc(selector, size) {
	let firstImage = getImageSize(size);
	getElement(document, selector).src = firstImage;
}

export class ScrollStick {
	constructor(obj) {
		this.excludeDevices = obj.excludeDevices || [];
		this.el =
			obj.element instanceof HTMLElement ? obj.element : document.querySelector(obj.element);
		this.stickAfterEl =
			obj.stickAfterEl instanceof HTMLElement ? obj.stickAfterEl : document.querySelector(obj.stickAfterEl);

		if (this.el && this.stickAfterEl) {
			this.init();
		}
	}

	get position() {
		return getDistanceFromTopOfDocument();
	}

	get offSet() {
		return getOffsetTop(this.stickAfterEl);
	}

	checkDevices() {
		if (this.excludeDevices.length) {
			this.excludeDevices.forEach(device => {
				if (window.breakpoint.value === device) {
					return true;
				}

				return false;
			});
		}
	}

	stickyCheck() {
		const excludedDevice = this.checkDevices();
		if (excludedDevice) {
			return false;
		}

		if (this.position > this.offSet) {
			addClass(this.el, 'stick');
		} else {
			removeClass(this.el, 'stick');
		}

		return true;
	}

	init() {
		this.stickyCheck();
		window.addEventListener('breakpointChanged', this.stickyCheck.bind(this));
		window.addEventListener('scroll', this.stickyCheck.bind(this));
	}
}

export function setBodyClass(className) {
	const element = document.querySelector(`.${className}`);

	if (element) {
		document.body.classList.add(className);
		return true;
	}

	return false;
}

export function getParent(element, className) {
	if (
		element instanceof HTMLElement === false ||
		typeof className !== 'string'
	) {
		return false;
	}

	let parent = element;

	while (!parent.classList.contains(className)) {
		parent = parent.parentElement;

		if (parent.classList.contains(className) || parent === document.body) {
			break;
		}
	}

	return parent === document.body ? false : parent;
}
