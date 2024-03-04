import UsersList from './UsersList.js';
import AddedUsers from './AddedUsers.js';
import { state, useState, useContext } from 'react';
import { UserContext } from '../../UserWrapper.js';
import '../../App.css';
import axios from 'axios';

export default function NewConversationPopup({ setShowPopup }) {

    const userContext = useContext(UserContext);

    const [ conversation, setConversation ] = useState({ members: [], messages: [] });

    const addUser = (user) => {
        for(let i = 0; i < conversation.members.length; i++) {
            if(conversation.members[i]._id === user._id) {
                return false;
            }
        }
        setConversation({ ...conversation, members: [ ...conversation.members, user ]});
    }
    const removeUser = (user) => {
        let newMembers = conversation.members.filter(member => {
            return member._id !== user._id;
        });
        setConversation({ ...conversation, members: newMembers });
    }

    //Sends members ids vs members for efficiency
    const createNewConversation = async (newConversation) => {
        conversation.members.push(userContext.user);

        const res = await axios.post('http://localhost:8080/createConversation', { conversation: newConversation }).catch(err => {
            console.log(err);
        });

    }

    return(
        <div className="newConversationPopup">
            <div className="newConversationPopupHeader">
                <span className="newConversationHeaderText" >New Conversation</span>
                <button className="closeNewConversationPopupButton" onClick={() => {
                    setShowPopup(false);
                }}>x</button>
            </div>
            <div className="newConversationPopupWrapper" >
                <UsersList addUser={addUser} />
                <AddedUsers users={conversation.members} removeUser={removeUser} />
                
            </div>
            <div className="newConversationPopupFooter">
                    <button className="startNewConversationButton" onClick={() => {
                        createNewConversation(conversation);
                        setShowPopup(false);
                        
                    }}>Start</button>
                </div>
        </div>
    );
}