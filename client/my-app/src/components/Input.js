import { state, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../UserWrapper.js';

export default function Input({ socket, currentConversation }) {

    const userContext = useContext(UserContext);


    const [ message, setMessage ] = useState("");

    return(
        <div className="inputWrapper">
            <input className="input" placeholder="..." onChange={(e) => {
                setMessage(e.target.value);
            }}></input>
            <button onClick={() => {
                let newMessage = {
                    content: message,
                    sender: userContext.user._id,
                    time: Date.now()
                }

                socket.emit('newMessage', newMessage);
                saveMessage(newMessage);
            }} className="sendNewMessage">Send</button>
        </div>
    );

    function saveMessage(message) {
        axios.post(`http://localhost:8080/saveMessage/${currentConversation._id}`, { 
            message: message
         }).then((res) => {
            console.log('Saved message: ' + res);
        }).catch(err => {
            console.log("Error saving message... " + err);
        });
    
    }
}