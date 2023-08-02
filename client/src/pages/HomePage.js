import React, { useState, useEffect } from "react";
import { get, post } from "../utilities.js";
import { socket } from "../client-socket.js";

const HomePage = (props) => {
	get("/api/test").then((res) => {
		console.log(res.message)
	});

	return (
		<div>
			<div>Hello</div>
			<div>{props.exapmle}</div>
		</div>
	);
};

export default HomePage;
