import React from "react";
import { get, post } from "../utilities.js"

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
