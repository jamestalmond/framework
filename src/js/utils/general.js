// jshint -W027

export function isUndefined(ref) {
	return typeof ref === 'undefined';
}

export function getReviewVideo(obj) {
	var reviewVideo = obj.videos.filter(function(video) {
		return video.isReviewVideo;
	});
	return reviewVideo[0];
}

export function getTimeInMinutes(time, terrirtory) {
	if (!isNaN(time)) {
		var minutes = Math.floor(time / 60);
		var seconds = time % 60;

		switch (terrirtory) {
			case 'AOL':
				return minutes + ' min ' + seconds + ' sec';
				break;
			case 'ADE':
				return minutes + ':' + seconds + ' min';
				break;
			case 'ANL':
				return minutes + ':' + seconds + ' min';
				break;
			default:
				return minutes + ' min ' + seconds + ' sec';
		}
	} else {
		throw new Error('The data passed into getTimeInMinutes is not a number.');
	}
}

export function isEs5() {
	return !![].forEach;
}

export function isNotIe8() {
	return !!document.addEventListener;
}

export function isSmartPhone() {
	return window.breakpoint.value === 'mobile';
}

export function isTablet() {
	return window.breakpoint.value === 'tablet';
}

export function getDeviceType() {
	return window.breakpoint.value;
}

export function are3DTransformsSupported() {
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
		if (div.style[t] !== undefined) {
			div.style[t] = 'translate3d(1px, 1px, 1px)';
			has3D.support = window.getComputedStyle(div).getPropertyValue(transforms[t]) === 'none' ? false : true; has3D.prefix = transforms[t];
		}
	}

	document.body.removeChild(div);
	return has3D;

}

export function isInt(num) {
	return Number(num) === num && num % 1 === 0;
}

export function getParam(term) {
    const query = window.location.search;
    const pIndex = query.indexOf(term + '=');
    if (pIndex > -1) {
        const ampIndex = query.indexOf('&', pIndex);
        const value = query.substring(pIndex + term.length + 1, ampIndex > -1 ? ampIndex : query.length);
        return value;
    }
}

export function debounce(func, wait, immediate) {
	let timeout;
	return function() {
		let context = this;
		let args = arguments;
		let later = () => {
			timeout = null;
			if (!immediate) {
				func.apply(context, args);
			}
		};
		let callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) {
			func.apply(context, args);
		}
	};
}

export function findIndexByKeyProperty(array, key, property) {
	for (var i = 0; i < array.length; i++) {
		if (array[i][key] == property) {
			return i;
		}
	}

	return false;
}

export function createReactKey() {
	return Math.random()
		.toString(16)
		.substr(2, 9);
}

export function getTerritory() {
	return window.DRLJs.Localization.Global.productBase.localNav;
}

export function isPremiumProduct() {
	const data = document.querySelector('[data-premium-product]');

	if (!data) {
		return false;
	}

	return data.getAttribute('data-premium-product');
}

export function addProductToCompareBar(evt) {
	const container = document.querySelector('.mainContainer');
	if (!container) {
		return false;
	}

	const sku = container.getAttribute('data-product-sku');
	const applianceTypeId = container.getAttribute('data-appliance-type-id');

	if (sku && applianceTypeId) {
		window.CompareSystem.addProductToCompare(sku, applianceTypeId);
		fireTag(evt);
	}
}

export function nested(obj) {
	if (obj.constructor !== Object) {
		throw new Error('nested() first argument needs to be an Object');
	}

	return {
		get(arr) {
			return arr.reduce(function(a, b) {
				return a && a[b] ? a[b] : null;
			}, obj);
		},

		set(arr, val) {
			const setObj = Object.assign({}, obj);

			return arr.reduce(function(a, b, index) {
				if (a && a[b] && index + 1 !== arr.length) {
					return a && a[b] ? a[b] : null;
				}

				a[b] = val;
				return setObj;

			}, setObj);
		}
	};
}

export function cookie(name) {
	return {
		get() {
			const nameEQ = `${name}=`;
			const ca = document.cookie.split(';');

			for (let i = 0; i < ca.length; i++) {
				let c = ca[i];

				while (c.charAt(0) === ' ') {
					c = c.substring(1, c.length);
				}

				if (c.indexOf(nameEQ) === 0) {
					return c.substring(nameEQ.length, c.length);
				}
			}

			return null;
		},

		set(value, days) {
			let expires;

			if (days) {
				const date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				expires = `; expires=${date.toGMTString()}`;
			} else {
				expires = "";
			}

			document.cookie = `${name}=${value}${expires}; path=/`;
		},

		remove() {
			this.set('', -1);
		}
	};
}
