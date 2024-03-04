import Message from '../components/Message';
import Input from '../components/Input';
import { state, useState, useEffect } from 'react';
import { useContext, useRef } from 'react';
import { UserContext } from '../UserWrapper.js';

export default function CurrentConversation({ conversation, socket }) {

    const userContext = useContext(UserContext);

    //Keeps track of messages recieved since last HTTP request to get conversation data (which is every time a new conversation is selected as active).
    //Empty on every new render
    const [ newMessages, setNewMessages ] = useState([]);

    useEffect(() => {
            setNewMessages([]);
    }, [ conversation ]);
    
    socket.on('newMessage', message => {
        console.log("Recieved a new message: " + JSON.stringify(message));
        setNewMessages([ ...newMessages, message ]);
    });


    return(
        <div className="currentConversation">
            <div className="currentConversationMessages" id="currentConversationMessages">
                {!conversation?  <p>Select Conversation</p> : 
                <>
                    {conversation.messages.map(m => {

                        let username = getUsername(m.sender);
                        let own = isOwn(m.sender);

                        return <Message content={m.content} sendersName={username} own={own} />
                    })
                    }
                    {newMessages.map(m => {

                        let username = getUsername(m.sender);
                        let own = isOwn(m.sender);

                        console.log("Mapping a new message...");

                        return <Message content={m.content} sendersName={username} own={own} />
                    })
                    }
                    
                    
                </>
                }
            </div>
            <Input socket={socket} currentConversation={conversation} />
        </div>
    );

    function isOwn(sender) {
        return sender === userContext.user._id;
    }
    function getUsername(sender) {
        let username = "";
        for(let i = 0; i < conversation.members.length; i++) {
            if(conversation.members[i]?._id === sender) {
                return username = conversation.members[i].username;
            }
        }
        return username;
    }
}