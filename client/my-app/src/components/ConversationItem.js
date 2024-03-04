import '../App.css';
import { useState, useContext } from 'react';
import { UserContext } from '../UserWrapper';

export default function ConversationItem({ conversation, setCurrentConversation, isCurrent, numNewMessages }) {

    const userContext = useContext(UserContext);

    let members = conversation.members?.filter(member => {
        return member._id !== userContext.user._id;
    });

    let text = "";
    for(let i = 0; i < members?.length && i < 3; i++) {
        text += members[i].username;
        if(i !== members?.length-1 && i !== 2) {
            text += ', ';
        }
    }
    if(members?.length > 3) {
         text += ` and ${members?.length-3} more`;
    }

    let classes = "conversationItem";
    if(isCurrent) {
        classes += " isCurrent";
    }
    

    return(
        <div className={classes} onClick={(e) => {
            setCurrentConversation(conversation);
        }}>
            <p>{text}</p>
            {numNewMessages? <div className="conversationItemNotification">{numNewMessages}</div> : null }
        </div>
    )
}