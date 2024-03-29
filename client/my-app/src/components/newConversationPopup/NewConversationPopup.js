import UsersSearch from './UsersSearch.js';
import AddedUsers from './AddedUsers.js';
import { state, useState, useContext } from 'react';
import { UserContext } from '../../UserWrapper.js';
import '../../App.css';
import axios from 'axios';

export default function NewConversationPopup({ setShowPopup, conversations, setConversations }) {

    const userContext = useContext(UserContext);

    const [ conversation, setConversation ] = useState({ members: [], messages: [] });
    const [ searchResults, setSearchResults ] = useState([]);


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
                        if(validConversation(conversation)) {
                            createNewConversation(conversation);
                            setShowPopup(false);
                            setConversations([ ...conversations, conversation ]);
                        } else {
                            alert('Please select at least 1 other participant');
                        }
                        
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
    function validConversation(conversation) {
        const peopleBesidesCreator = conversation.members.length;
        if(peopleBesidesCreator < 1) {
            return false;
        }
        return true;
    }
    function addUser(user) {
        for(let i = 0; i < conversation.members.length; i++) {
            if(conversation.members[i]._id === user._id) {
                return false;
            }
        }
        setConversation({ ...conversation, members: [ ...conversation.members, user ]});
    }
    function removeUser(user) {
        let newMembers = conversation.members.filter(member => {
            return member._id !== user._id;
        });
        setConversation({ ...conversation, members: newMembers });
    }

    async function createNewConversation(newConversation) {
        conversation.members.push(userContext.user);

        const res = await axios.post('http://localhost:8080/createConversation', { conversation: newConversation }).catch(err => {
            console.log(err);
        });

    }
}