const express = module.require("express");

const portno = 3000;

const app = express();

app.use(express.static(__dirname));

app.get("/data", function(request, response) {
	console.log("hello");
	response.send("spoilers");

})

const server = app.listen(portno, function() {
	console.log("Listening " + __dirname);
})