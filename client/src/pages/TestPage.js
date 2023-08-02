import React, { useState, useEffect } from "react";
import "./TestPage.css";
import { get, post } from "../utilities.js";
import { socket } from "../client-socket.js";

const TestPage = (props) => {
	const [inputValue, setInput] = useState("");
	const [messages, setMessages] = useState("");
	const [roomID, setRoom] = useState("");

	function addMessage() {
		setMessages(messages + inputValue + "\n\n");
		socket.emit("new-message", inputValue, roomID)
		setInput("");
	}

	function submitRoom() {
		if (roomID) {
			socket.emit("join-room", roomID);
			setMessages(messages + "You've joined room: " + roomID + "\n\n");
		}
	}

	socket.on("new-message", (message) => {
		setMessages(messages + message + "\n\n");
	});

	return (
		<div className="test-page-container">
			<h1>Test Page</h1>
			<pre id="messages">{messages}</pre>
			<input type="text" id="input" placeholder="Message" value={inputValue} onChange={(e) => setInput(e.target.value)}/>
			<button id="submit" title="Send Message" onClick={addMessage}>Send Message</button>

			<input type="text" id="input" placeholder="Room ID" value={roomID} onChange={(e) => setRoom(e.target.value)}/>
			<button id="submit" onClick={submitRoom}>Set Room</button>
		</div>
	);
};

export default TestPage;
