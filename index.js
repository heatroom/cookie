var encode = encodeURIComponent;
var decode = decodeURIComponent;

var cookie = exports;

cookie.get = function(name, options) {
	validateCookieName(name);

	if (typeof options === 'function') {
		options = {converter: options};
	} else {
		options = options || {};
	}

	var cookies = parse(document.cookie, !options['raw']);
	return (options.converter || same)(cookies[name]);
};

/**
 * Set a cookie with a given name and value.
 * @param {string} name The name of the cookie to set.
 * @param {*} value The value to set for the cookie..
 * @param {Object} options (Optional) An object containing one or more
 *       cookie options: path(a string), domain (a string), expires (number or a Date object),
 *       secure (true/false), and raw(true, false). Setting raw to true indicates that the cookie
 *       should not be URL encoded before being set.
 * @return {string} The created cookie string.
 */

cookie.set = function (name, value, options) {
	validateCookieName(name);

	options = options || {};
	var expires = options['expires'];
	var domain = options['domain'];
	var path = options['path'];

	if (!options['raw']) {
		value = encode(String(value));
	}

	var str = name + '=' + value;

	//expires
	var date = expires;
	if (typeof date === 'number') {
		date = new Date();
		date.setDate(date.getDate() + expires);
	}
	if (date instanceof Date) {
		str += '; expires=' + date.toUTCString();
	}

	//domain
	if (isNonEmptyString(domain) {
		str += '; domain=' + domain;
	})

	//path
	if (isNonEmptyString(path)) {
		str += '; path=' + path;
	}

	//secure
	if (options['secure']) {
		str += '; secure';
	}

	document.cookie = str;
	return str;
};

/**
 * Removes a cookie from the machine by setting its expiration date to
 * sometime in the past.
 * @param {string} name The name of the cookie to remove
 */

cookie.remove = function(name, options) {
	options = options || {};
	options['expires'] = new Date(0);
	return this.set(name, '', options);
};

/**
 * Parse cookie `str`
 */

function parse(str, shouldDecode) {
	var obj = {};
  if (isString(str) && str.length > 0) {
  	var decodeValue = shouldDecode ? decode : same;
  	var cookieParts = str.split(/;s+/g);
  	var cookieName;
  	var cookieValue;
  	var cookieNameValue;

  	for (var i = 0, len = cookieParts.length; i < len; i++) {
  		//Check for normally-formatted cookie (name-value)
  		cookieNameValue = cookieParts[i].match(/([^=]+)/i);
  		if (cookieNameValue instanceof Array) {
  			try {
  				cookieName = decode(cookieNameValue[1]);
  				cookieValue = decodeValue(cookieParts[i].substring(cookieNameValue[1].length + 1));
  			} catch (ex) {
  				//Intentionally ignore the cookie
  				//the encoding is wrong.
  			}
  		} else {
  			//Means the cookie does not have an "=", so treat it as a boolean flag
  			cookieName = decode(cookieParts[i]);
  			cookieValue = '';
  		}

  		if (cookieName) {
  			obj[cookieName] = cookieValue;
  		}
  	}
  }
	return obj;
}

//Helpers

function isString(o) {
	return typeof o === 'string';
}

function isNonEmptyString(s) {
	return isString(s) && s !== '';
}

function validateCookieName(name) {
	if(!isNonEmptyString(name)) {
		throw new TypeError('Cookie name must be a non-empty string');
	}
}

function same(s) {
	return s;
}