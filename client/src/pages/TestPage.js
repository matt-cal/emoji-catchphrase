import React, { useState, useEffect } from "react";
import "./TestPage.css";
import { get, post } from "../utilities.js";
import { socket } from "../client-socket.js";
import EmojiPicker from 'emoji-picker-react';


const TestPage = (props) => {
	const [inputValue, setInput] = useState("");
	const [messages, setMessages] = useState([]);
	const [roomID, setRoom] = useState("");
	const [emojiPickerVisible, setEmojiPicker] = useState(false);
	const [messageInputHidden, setMessageInputHidden] = useState(false);
	const [gameButtonsHidden, setGameButtonsHidden] = useState(true);
	const [startGameHidden, setStartGameHidden] = useState(false);

	// adds message to personal feed; emits message to others connected to same room
	function addMessage(e) {
		e.preventDefault();
		setMessages([...messages, inputValue]);
		socket.emit("new-message", inputValue, roomID);
		setInput("");
	}

	// join new room
	function submitRoom() {
		if (roomID) {
			socket.emit("join-room", roomID);
			setMessages([...messages, "You've joined room: " + roomID]);
		}
	}

	// to receive new messages from other users
	socket.on("new-message", (message) => {
		setMessages([...messages, message]);
	});

	// to add emoji to message feed; emits to other users in same room
	function addEmoji(emoji, e) {
		setMessages([...messages, emoji.emoji]);
		socket.emit("new-message", emoji.emoji, roomID);
	}

	// emoji keyboard component
	function EmojiKeyboard() {
		if (emojiPickerVisible) {
			return <EmojiPicker className="emoji-picker" onEmojiClick={(emoji, e) => addEmoji(emoji, e)} height={360} width="50%" />
		}
	}

	// gives player a new phrase; toggles emoji keyboard for only them
	function newPhrase() {
		setEmojiPicker(true);
		setMessageInputHidden(true);
		setGameButtonsHidden(false);
		get("/api/phrase").then((res) => {
			setMessages([...messages, `Your Phrase is: ${res.phrase}`]);
		});
	}

	// called when other player correctly guesses phrase
	// hides emoji keyboard for current player,
	// toggles normal message input for current player,
	// emits to other player to give them a phrase
	function correct() {
		setEmojiPicker(false);
		setMessageInputHidden(false);
		setGameButtonsHidden(true);
		socket.emit("new-message", "You Guessed Correctly!", roomID);
		socket.emit("correct-guess", roomID);
		setMessages([...messages, "Your Partner Got A New Phrase. Start Guessing!"]);
	}

	// received when this client made a correct guess
	// gives them a new phrase to give hints for
	socket.on("correct-guess", () => {
		newPhrase();
	});

	// when give up button is pressed
	function giveUp() {
		setEmojiPicker(false);
		setMessageInputHidden(false);
		setGameButtonsHidden(true);
		socket.emit("new-message", "Your Partner Gave Up. Your Turn!", roomID);
		socket.emit("give-up", roomID);
		setMessages([...messages, "You gave up. Now it's your partner's turn!"]);
	}

	// received when partner gave up
	socket.on("give-up", () => {
		newPhrase();
	});

	function startGame() {
		newPhrase();
		setStartGameHidden(true);
		socket.emit("start-game", roomID);
	}

	// received when partner starts game
	socket.on("start-game", () => {
		setStartGameHidden(true);
		setMessages([...messages, "Your Partner Started The Game! Start Guessing Their Phrase!"]);
	});

	return (
		<div className="test-page-container">
			<h1>Test Page</h1>

			<ul className="messages">
				{messages.map(message => {
					return <li>{message}</li>
				})}
			</ul>

			<EmojiKeyboard />

			<div hidden={messageInputHidden}>
				<form onSubmit={(e) => addMessage(e)}>
					<input type="text" id="input" placeholder="Message" value={inputValue} onChange={(e) => setInput(e.target.value)}/>
					<input type="submit" id="submit" title="Send Message"></input>
				</form>

				<input type="text" id="input" placeholder="Room ID" value={roomID} onChange={(e) => setRoom(e.target.value)}/>
				<button id="submit" onClick={submitRoom}>Set Room</button>
			</div>

			<button onClick={startGame} hidden={startGameHidden}>Start Game</button>
			<button onClick={correct} hidden={gameButtonsHidden}>Correct!</button>
			<button onClick={giveUp} hidden={gameButtonsHidden}>Give Up</button>
		</div>
	);
};

export default TestPage;
