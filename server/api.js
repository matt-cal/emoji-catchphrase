const express = require("express");
const router = express.Router();
const {phrases} = require("./phrases.js");

// api endpoints
// these paths will all be prefixed with "/api/"

// import get and post from client/src/utilities.js to make requests
/* example: 
get("/api/test").then((res) => {
	console.log(res.message)
});
*/

// example
// will be path "/api/test"
router.get("/test", (req, res) => {
	res.send({
		message: "WORKING"
	});
});

router.get("/phrase", (req, res) => {
	res.send({
		phrase: phrases[Math.floor(Math.random()*phrases.length)]
	})
});

module.exports = router;
