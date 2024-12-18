xhr = new XMLHttpRequest();

xhr.onreadystatechange = handler;

xhr.open("GET", "data");

xhr.send();
function handler(event) {
	console.log('help');
	if(this.readyState !== 4) return;
	if(this.status !== 200) return;

	const text = this.responseText;
	const hha = document.getElementById("hha");
	// hha.textContent = text;
	hha.innerHTML = text;
	console.log("--" + text );
}	

