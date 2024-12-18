'use strict';
function cs142MakeMultiFilter(originalArray) {
	var currentArray = originalArray;
	function filt(filterCriteria, callback) {

		if(currentArray === undefined) {
			currentArray = originalArray;
		}
		if(filterCriteria === undefined) {
			return currentArray;
		}
		currentArray = currentArray.filter((val) => filterCriteria(val));
		
		if(typeof callback === "function") {
			callback.call(originalArray, currentArray);
		}
		return filt;

	}
	return filt;
}