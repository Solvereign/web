'use strict';
/*
class Cs142TemplateProcessor {
	constructor(template) {
		this.text = template;
	}
	fillIn(dictionary) {
		let localt = this.text;
		if(typeof dictionary === 'object') {
			
			for(let property in dictionary) {
				let reg = '{{' + property + '}}';
				localt = localt.replaceAll(reg, dictionary[property]);
			}
			const reg = /{{\w+}}/g;
			localt = localt.replaceAll(reg, "");
		}
		return localt;
	}
}
*/
// /*
function Cs142TemplateProcessor(template) {
	if(typeof template === 'string') {
		this.text = template;
	}
}

Cs142TemplateProcessor.prototype.fillIn = function(dictionary) {
	let localt = this.text;
	if(typeof dictionary === 'object') {

		for(const property in dictionary) {
			if(typeof property === 'string') {
				const reg = '{{' + property + '}}';
				localt = localt.replaceAll(reg, dictionary[property]);
			}
		}

		const reg = /{{\w+}}/g;
		localt = localt.replaceAll(reg, "");

	}
	return localt;
};
// */