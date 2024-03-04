import UsersList from './UsersList.js';
import UsersSearch from './UsersSearch.js';
import AddedUsers from './AddedUsers.js';
import { state, useState, useContext } from 'react';
import { UserContext } from '../../UserWrapper.js';
import '../../App.css';
import axios from 'axios';

export default function NewConversationPopup({ setShowPopup }) {

    const userContext = useContext(UserContext);

    const [ conversation, setConversation ] = useState({ members: [], messages: [] });
    const [ searchResults, setSearchResults ] = useState([]);

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
        console.log("creating");
        conversation.members.push(userContext.user);

        const res = await axios.post('http://localhost:8080/createConversation', { conversation: newConversation }).catch(err => {
            console.log(err);
        });

    }

    return(
        <div className="newConversationPopup">
            <div className="newConversationPopupHeader">
                <button className="closeNewConversationPopupButton" onClick={() => {
                    setShowPopup(false);
                }}>x</button>
            </div>
            <div className="newConversationPopupWrapper" >
                <UsersSearch addUser={addUser} searchForUsers={searchForUsers} results={searchResults}/>
                <AddedUsers users={conversation.members} removeUser={removeUser} />
                
            </div>
            <div className="newConversationPopupFooter">
                    <button className="startNewConversationButton" onClick={() => {
                        console.log('clicked');
                        createNewConversation(conversation);
                        setShowPopup(false);
                        
                    }}>Start</button>
                </div>
        </div>
    );
    async function searchForUsers(email) {
        const results = [];
        let config = {
            headers: {
            'Authorization': `Bearer ${localStorage.getItem("JWT")}`
            }
        }
        await axios.get(`http://localhost:8080/searchForUsers/${email}`, config).then(res => {
            results.push(...res.data);
        });
        console.log("inSearchForUsers: " + JSON.stringify(results));
        setSearchResults(results);
        return results;
    }
}