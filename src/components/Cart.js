
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import { Windows } from 'react-bootstrap-icons';
import { db } from '../config'
import { AuthContext } from '../context/authContext';
import { ProductsContext } from '../context/productsContext';



function Cart() {

	// console.log("db", db)

	const [messages, setMessages] = useState(null)
	const [chatMsg, setChatMsg] = useState("")
	const { user } = useContext(AuthContext)
	const { products } = useContext(ProductsContext)

	// console.log("hola q ase", user)

	const getMessages = () => {
		const q = query(collection(db, "Cartshop"), orderBy("date", "asc"));
		// const q = query(collection(db, "cities"), where("state", "==", "CA"));
		onSnapshot(q, (querySnapshot) => {
			const myMessages = [];
			querySnapshot.forEach((doc) => {
				myMessages.push(doc.data());
				// console.log("MyMessages", myMessages)
			});
			// console.log(myMessages);
			setMessages(myMessages)
		});
	}


	useEffect(() => {
		getMessages()
	}, [])

	const handleMessageChange = (e) => {
		console.log(e.target.value)
		setChatMsg(e.target.value)

	}

	const handleChatMessageSubmit = async () => {
		setChatMsg("")
		const messageObj = {
			text: chatMsg,
			author: user.email,
			date: new Date() //crea la fecha actual
		}
		try {
			const docRef = await addDoc(collection(db, "Cartshop"), messageObj);
			console.log("Document written with ID: ", docRef.id);

		} catch (e) {
			console.error("Error adding document: ", e);
		}
	}

	console.log('Products: ', products)

	return (
		<div>
			<h1 className="fs-1 fw-bold pt-5 text-center">Chat</h1>
			<p className="text-center">Write a message</p>
			<ol className="messages">

			</ol>

			<InputGroup className="p-3">
				<FormControl
					placeholder="Enter your message..."
					aria-label="Enter your message..."
					aria-describedby="basic-addon1"
					value={chatMsg}
					onChange={handleMessageChange}
					onKeyDown={(e) => e.key === 'Enter' && handleChatMessageSubmit()}
				/>
				<Button variant="danger" onClick={handleChatMessageSubmit}>Send</Button>
			</InputGroup>
		</div>
	);
}

export default Cart