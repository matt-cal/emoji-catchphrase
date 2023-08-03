import React, { useState, useEffect } from "react";
import "./TestPage.css";
import { get, post } from "../utilities.js";
import { socket } from "../client-socket.js";
import EmojiPicker from 'emoji-picker-react';


const TestPage = (props) => {
	const [inputValue, setInput] = useState("");
	const [messages, setMessages] = useState([]);
	const [roomID, setRoom] = useState("");

	function addMessage(e) {
		e.preventDefault();
		setMessages([...messages, inputValue]);
		socket.emit("new-message", inputValue, roomID);
		setInput("");
	}

	function submitRoom() {
		if (roomID) {
			socket.emit("join-room", roomID);
			setMessages(messages + "You've joined room: " + roomID + "\n\n");
		}
	}

	socket.on("new-message", (message) => {
		setMessages([...messages, message]);
	});

	function addEmoji(emoji, e) {
		setMessages([...messages, emoji.emoji]);
		socket.emit("new-message", emoji.emoji, roomID);
	}

	return (
		<div className="test-page-container">
			<h1>Test Page</h1>

			<ul className="messages">
				{messages.map(message => {
					return <li>{message}</li>
				})}
			</ul>

			{/* <EmojiPicker className="emoji-picker" onEmojiClick={(emoji, e) => addEmoji(emoji, e)} height={360} width="50%" /> */}

			<form onSubmit={(e) => addMessage(e)}>
				<input type="text" id="input" placeholder="Message" value={inputValue} onChange={(e) => setInput(e.target.value)}/>
				<input type="submit" id="submit" title="Send Message"></input>
			</form>

			<input type="text" id="input" placeholder="Room ID" value={roomID} onChange={(e) => setRoom(e.target.value)}/>
			<button id="submit" onClick={submitRoom}>Set Room</button>
		</div>
	);
};

export default TestPage;
