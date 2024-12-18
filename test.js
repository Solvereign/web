'use strict';
function Cs142TemplateProcessor(template) {
	if(typeof template == 'string') {
		this.text = template;
	}
}

Cs142TemplateProcessor.prototype.fillIn = function(dictionary) {
	let localt = this.text;
	if(typeof dictionary == 'object') {
		for(let property in dictionary) {
			let reg = '{{' + property + '}}';
			localt = localt.replaceAll(reg, dictionary[property]);
		}
		let reg = /{{\w+}}/g;
		localt = localt.replaceAll(reg, "");
	}
	return localt;
}

function Var()  {
	this.obj = {};
}

Var.prototype.add = function(name, property) {
	if(!this.obj.hasOwnProperty(name)) {
		this.obj[name] = property;
	}
	else console.log("property", name, "is already declared");
	
}

Var.prototype.get = function(name) {
	return this.obj[name];
}

Var.prototype.set = function(name, property) {
	if(this.obj.hasOwnProperty(name)) {
		this.obj[name] = property;
	}
	else console.log("no varible", name," exists");
}

Var.prototype.list = function() {
	console.log(this.obj);
}
let vars = new Var();
vars.add("template", "My favorite month is {{month}} but not the day {{day}} or the year {{year}}");
vars.add("dateTemplate", new Cs142TemplateProcessor(vars.get("template")));

vars.add("dictionary", {month: "July", day: "1", year: "2016"});
vars.add("str", vars.get("dateTemplate").fillIn(vars.get("dictionary")));

console.log(vars.get("str") === "My favorite month is July but not the day 1 or the year 2016");

// Case: property doesn't exist in dictionary
vars.add("dictionary2", {day: "1", year: "2016"});
vars.set("str", vars.get("dateTemplate").fillIn(vars.get("dictionary2")));

console.log(vars.get("str") === "My favorite month is  but not the day 1 or the year 2016");

vars.list();

// console.log(vars);