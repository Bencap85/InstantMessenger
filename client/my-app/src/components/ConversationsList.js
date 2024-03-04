import { state, useState, useEffect, useContext } from 'react';
import ConversationItem from './ConversationItem';
import { UserContext } from '../UserWrapper';
import '../App.css';

export default function ConversationsList({ conversations, setShowPopup, setCurrentConversation, currentConversation }) {

    const userContext = useContext(UserContext);

    const idToNewMessages = new Map();
    for(let conversation of conversations) {
        const newMessages = conversation.messages.filter(m => conversation.lastViewedByMember[userContext.user._id] < m.time);
        // console.log("New Messages: " + JSON.stringify(newMessages));
        idToNewMessages.set(conversation._id, newMessages);
    }
    for(const [key, value] of idToNewMessages) {
        console.log(key + " --> " + JSON.stringify(value));
    }

    return(
        <div className="conversationsList">
            <button className="newConversationButton" onClick={() => {
                setShowPopup(true);
            }}>+</button>
            {conversations.map(conversation => {
                
                return <ConversationItem conversation={conversation}
                                         setCurrentConversation={setCurrentConversation}
                                         isCurrent={conversation._id === currentConversation?._id} 
                                         numNewMessages={idToNewMessages.get(conversation._id).length}
                                         />;
            })}
        </div>
    );
}