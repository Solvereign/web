let dict = {
	ner: "Tseegii",
	owog: "D"
}

let str = "hello {{owog}}.{{ner}}";
let arr = str.match(/\{\{(.*?)\}\}/g);
arr = arr.map((val, idx) => {
	return val.substring(2, val.length-2);
})
console.log(arr)
// arr = ["{{owog}}", "{{ner}}"]
console.log(dict[arr[0]], dict[arr[1]]);
// console.log(str.match(/\{\{(.*?)\}\}/g))
console.log(str.search(/\{\{(.*?)\}\}/g))