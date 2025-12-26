/*
 * Copyright (c) 2025 Bloxtor (http://bloxtor.com) and Joao Pinto (http://jplpinto.com)
 * 
 * Multi-licensed: BSD 3-Clause | Apache 2.0 | GNU LGPL v3 | HLNC License (http://bloxtor.com/LICENSE_HLNC.md)
 * Choose one license that best fits your needs.
 *
 * Original PHP to Diagram Repo: https://github.com/a19836/php-to-diagram/
 * Original Bloxtor Repo: https://github.com/a19836/bloxtor
 *
 * YOU ARE NOT AUTHORIZED TO MODIFY OR REMOVE ANY PART OF THIS NOTICE!
 */

/** START: Add some default functions in case they don't exist **/

if (!Element.prototype.querySelectorAll || !Element.prototype.querySelector)
	alert("Browser doesn't support this features. Please run this on a more modern browser!");

//create closest function bc on some IE this doesn't exists
if (!Element.prototype.closest) 
	Element.prototype.closest = function (css) {
		var node = this;
		while (node) {
			if (node.matches(css)) 
				return node;
			else 
				node = node.parentElement;
		}
		return null;
	};

//create matches function bc on some IE this doesn't exists
if (!Element.prototype.matches)
	Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector;

//Fix for IE7 and lower bc on some IE this doesn't exists
if (!document.querySelectorAll)
	document.querySelectorAll = function (selectors) {
		var style = document.createElement('style'), elements = [], element;
		document.documentElement.firstChild.appendChild(style);
		document._qsa = [];

		style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
		window.scrollBy(0, 0);
		style.parentNode.removeChild(style);

		while (document._qsa.length) {
			element = document._qsa.shift();
			element.style.removeAttribute('x-qsa');
			elements.push(element);
		}

		document._qsa = null;
		return elements;
	};

//Fix for IE7 and lower bc on some IE this doesn't exists 
if (!document.querySelector)
	document.querySelector = function (selectors) {
		var elements = document.querySelectorAll(selectors);
		return (elements.length) ? elements[0] : null;
	};

//add querySelectorAllInNodes - new methods by JP
if (typeof querySelectorAllInNodes != "function")
	function querySelectorAllInNodes(nodes, selectors) {
		var elements = [], l2, node, elms, j;
		
		if (nodes)
			for (var i = 0, l1 = nodes.length; i < l1; i++) {
				node = nodes[i];

				if (node && node.nodeType == Node.ELEMENT_NODE) {
					elms = node.querySelectorAll(selectors);
					l2 = elms ? elms.length : 0;

					if (l2)
						for (j = 0; j < l2; j++)
							elements.push(elms[j]);
				}
			}

		return elements;
	};

//add querySelectorInNodes - new methods by JP
if (typeof querySelectorInNodes != "function")
	function querySelectorInNodes(nodes, selectors) {
		var elements = querySelectorAllInNodes(nodes, selectors);
		return (elements.length) ? elements[0] : null;
	};

//add filterSelectorAllInNodes - new methods by JP
if (typeof filterSelectorAllInNodes != "function")
	function filterSelectorAllInNodes(nodes, selectors) {
		var elements = [], node;
		
		if (nodes) 
			for (var i = 0, l = nodes.length; i < l; i++) {
				node = nodes[i];

				if (node && node.nodeType == Node.ELEMENT_NODE && node.matches(selectors))
					elements.push(node);
			}

		return elements;
	};

//add filterSelectorInNodes - new methods by JP
if (typeof filterSelectorInNodes != "function")
	function filterSelectorInNodes(nodes, selectors) {
		var elements = filterSelectorAllInNodes(nodes, selectors);
		return (elements.length) ? elements[0] : null;
	};

//Leave this code here, because is a generic function that is used in multiple places
if (typeof assignObjectRecursively != "function")
	function assignObjectRecursively(to_obj, from_obj) {
		//return Object.assign(to_obj, from_obj); //Note that Object.assign doesn't copy the inner objects, which means it will remain with the references for the inner objects. Basically the Object.assign only clones the properties in the first level.
		//Do not use JSON.parse(JSON.stringify(from_obj)), bc obj may contain DOM objects that will loose its references, and this elements we want to keep their reference.
		
		//Simulates the jquery function: $.isPlainObject(obj); Copied from jquery 3.6.0
		var is_plain_object = function(obj) {
			//return (typeof obj === "object" && obj !== null && typeof Array.isArray == "function" && !Array.isArray(obj)) || Object.prototype.toString.call(obj) === "[object Object]";
			
			//defined some jquery global vars
			var getProto = Object.getPrototypeOf;
			var class2type = {};
			var toString = class2type.toString;
			var hasOwn = class2type.hasOwnProperty;
			var fnToString = hasOwn.toString;
			var ObjectFunctionString = fnToString.call( Object );
			
			//code from isPlainObject in jquery 3.6.0
			var proto, Ctor;

			// Detect obvious negatives
			// Use toString instead of jQuery.type to catch host objects
			if ( !obj || toString.call( obj ) !== "[object Object]" ) {
				return false;
			}

			proto = getProto( obj );

			// Objects with no prototype (e.g., `Object.create( null )`) are plain
			if ( !proto ) {
				return true;
			}

			// Objects with prototype are plain iff they were constructed by a global Object function
			Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
			return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
		};
		
		//Simulates the jquery function: $.isArray(obj);
		var is_array = function(obj) {
			return (typeof Array.isArray == "function" && Array.isArray(obj)) || Object.prototype.toString.call(obj) === '[object Array]';
		};
		
		var is_to_arr = is_array(to_obj);
		
		if (is_plain_object(from_obj)) { //if is plain object
			for (var k in from_obj) {
				var v = from_obj[k];
				
				if (is_plain_object(v))
					v = assignObjectRecursively({}, v);
				else if (is_array(v))
					v = assignObjectRecursively([], v);
				
				if (is_to_arr)
					to_obj.push(v);
				else
					to_obj[k] = v;
			}
			
			return to_obj;
		}
		else if (is_array(from_obj)) { //if is array
			for (var i = 0, t = from_obj.length; i < t; i++) {
				var v = from_obj[i];
				
				if (is_plain_object(v))
					v = assignObjectRecursively({}, v);
				else if (is_array(v))
					v = assignObjectRecursively([], v);
				
				if (is_to_arr)
					to_obj.push(v);
				else
					to_obj[i] = v;
			}
			
			return to_obj;
		}
		
		return from_obj;
	}

//Leave this code here, because is adding the TRIM function to the IE browsers. Otherwise the browser gives errors.
if(typeof String.prototype.trim !== 'function')
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, ''); 
	};

//Leave this code here, because is adding the hashCode function to all browsers.
if(typeof String.prototype.hashCode !== 'function')
	String.prototype.hashCode = function() {
		var hash = 0;
		
		if (this.length == 0) 
			return hash;
		
		for (i = 0; i < this.length; i++) {
			char = this.charCodeAt(i);
			hash = ((hash<<5) - hash) + char;
			hash = hash & hash; // Convert to 32bit integer
		}
		return hash;
	};

//Fixing IE issue with the console apply method. This is used in the ACE.js file
if(console.warn && typeof console.warn.apply !== 'function')
	console.warn = Function.prototype.bind.call(console.warn, console);

//Fixing IE issue with the console apply method. This is used in the ACE.js file
if(console.log && typeof console.log.apply !== 'function') 
	console.log = Function.prototype.bind.call(console.log, console);

/** END: Add some default functions in case they don't exist **/

/* START: List/Table indexes functions
	Example:
		<table>
			<thead>
				<tr>
					<th class="value">Text</th>
					<th class="title">Title</th>
					<th class="url">Url</th>
					<th class="class">Class</th>
					<th class="actions">
						<i class="icon add" onClick="addLink(this)"></i>
					</th>
				</tr>
			</thead>
			<tbody index_prefix="links">
				<tr class="no_links"><td colspan="4">There are no links...</td></tr>
			</tbody>
		</table>
		
		<script>
			function addLink(elm) {
				var tbody = $(elm).parent().closest("table").children("tbody");
				tbody.children(".no_links").hide();
				var index = getListNewIndex(tbody);
				
				var row = '<tr>'
					+ '<td class="value"><input class="task_property_field" type="text" name="links[' + index + '][value]"/></td>'
					+ '<td class="url"><input class="task_property_field" type="text" name="links[' + index + '][url]"/></td>'
					+ '<td class="actions"><i class="icon remove" onClick="removeLink(this)"></i></td>'
				+ '</tr>';
				
				row = $(row);
				tbody.append(row);
				
				return row;
			}
			
			function removeLink(elm) {
				var tr = $(elm).parent().closest("tr");
				var tbody = tr.parent();
				
				tr.remove();
				
				if (tbody.children().length == 1)
					tbody.children(".no_links").show();
			}
		</script>
*/
function getListChildItemDefaultSelector() {
	return "input, textarea, select";;
}

function getListChildItemNameIndex(name, prefix) {
	if (name) {
		if (prefix)
			prefix = prefix.replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/\[/g, "\\[").replace(/\]/g, "\\]");
		
		var myRegexp = new RegExp("^" + prefix + "\\[([0-9]+)\\]");
		var match = myRegexp.exec(name);
		var index = match ? parseInt(match[1]) : null;
		
		if ($.isNumeric(index))
			return index;
	}
	
	return null;
}

function getListChildItemIndex(item, prefix) {
	return getListChildItemNameIndex(item.attr("name"), prefix);
}

function getListNewIndex(parent, selector) {
	var last_index = 0;
	
	//getting prefix
	var prefix = parent.attr("index_prefix");
	
	if (prefix) {
		//getting last index for children
		selector = selector ? selector : getListChildItemDefaultSelector();
		var items = parent.find(selector);
		
		$.each(items, function(idx, item) {
			var index = getListChildItemIndex( $(item), prefix);
			
			if ($.isNumeric(index) && index > last_index)
				last_index = index;
		});
	}
	
	return last_index + 1;
}

