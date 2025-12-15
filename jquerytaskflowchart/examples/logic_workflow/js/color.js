/*
 * Copyright (c) 2025 Bloxtor (http://bloxtor.com) and Joao Pinto (http://jplpinto.com)
 * 
 * Multi-licensed: BSD 3-Clause | Apache 2.0 | GNU LGPL v3 | HLNC License (http://bloxtor.com/LICENSE_HLNC.md)
 * Choose one license that best fits your needs.
 *
 * Original JQuery Task flow Chart Repo: https://github.com/a19836/jquerytaskflowchart/
 * Original Bloxtor Repo: https://github.com/a19836/bloxtor
 *
 * YOU ARE NOT AUTHORIZED TO MODIFY OR REMOVE ANY PART OF THIS NOTICE!
 */

if(typeof getContrastYIQ !== 'function') {
	//http://24ways.org/2010/calculating-color-contrast/
	//alert( getContrastYIQ("#EF4444") ); //white
	function getContrastYIQ(hexcolor){
		hexcolor = hexcolor.substr(0, 1) == "#" ? hexcolor.substr(1) : hexcolor;
		
		var r = parseInt(hexcolor.substr(0, 2), 16);
		var g = parseInt(hexcolor.substr(2, 2), 16);
		var b = parseInt(hexcolor.substr(4, 2), 16);
		
		var yiq = ((r*299)+(g*587)+(b*114))/1000;
		
		return (yiq >= 128) ? 'black' : 'white';
	}
}

if(typeof rgbToHex !== 'function') {
	function componentToHex(c) {
		var hex = parseInt(c).toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	//console.log("rgbToHex(0, 51, 255) => " + rgbToHex(0, 51, 255) ); // #0033ff
	//console.log("rgbToHex(0, 51, 255, .5) => " + rgbToHex(0, 51, 255, .5) ); // #0033ff80
	//console.log("rgbToHex(0, 51, 255, 40%) => " + rgbToHex(0, 51, 255, "40%") ); // #0033ff66
	function rgbToHex(r, g, b, a) {
		var opacity = "";
		
		if (typeof a != undefined && a != null) {
			if (("" + a).indexOf("%") != -1) //in case the a is a percentage
     			a = a.substr(0, a.length - 1) / 100;
			
			//convert a value to letters
			opacity = Math.round(a * 255).toString(16);
			
			if (opacity.length == 1)
	    			opacity = "0" + opacity;
		}
		
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b) + opacity;
	}
}

if(typeof colorRgbToHex !== 'function') {
	//alert( colorRgbToHex("rgb(0, 51, 255)") ); // #0033ff
	function colorRgbToHex(color) {
		var m = color.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
		
		if (!m)
			m = color.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*([0-9]+(\.[0-9]*)?|\.[0-9]+)\s*)?\)$/i);
		
		if (m)
			return rgbToHex(m[1], m[2], m[3], m[5]);
	}
}
