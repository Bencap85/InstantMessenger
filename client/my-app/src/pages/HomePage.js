import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserWrapper';
import axios from 'axios';
import Header from '../components/Header';
import ConversationsList from '../components/ConversationsList';
import CurrentConversation from '../components/CurrentConversation';
import NewConversationPopup from '../components/newConversationPopup/NewConversationPopup';

export default function HomePage({ socket }) {

    const location = useLocation();
    const navigate = useNavigate();

    const userContext = useContext(UserContext);

    const user = location.state?.user;
    const [ userData, setUserData ] = useState(null);
    const [ conversations, setConversations ] = useState([]);
    const [ currentConversation, setCurrentConversation ] = useState(null);
    const [ showPopup, setShowPopup ] = useState(false);

    //On load, make axios request to server to populate page for user inquestion
    useEffect(() => {
        if(!user || user.isAuthorized === false) {
            navigate('/login');
            return;
        } else {
            setUp();
        }
        
    }, [ currentConversation ]);

    useEffect(() => {
        window.addEventListener('beforeunload', e => {
            e.preventDefault()
            e.returnValue = ''
        })
        window.addEventListener('unload', e => {
            updateLastViewedByMember(currentConversation._id, Date.now());
        })
        return () => {
        }
      }, []);

    if(currentConversation) {
        updateLastViewedByMember(currentConversation._id, Date.now());
    }

    //////////////////////////
    //
    // On tab close, update last viewed time on server. Everything else is working
    //
    /////////////////////////

    

    
    return(
        <div>
            <Header />
            <div className="homeContentWrapper">
                {showPopup? <NewConversationPopup setShowPopup={setShowPopup} />: null }
                <ConversationsList conversations={conversations} setShowPopup={setShowPopup} setCurrentConversation={(conversation) => {
                    if(currentConversation) {
                        socket.emit('leaveConversation', currentConversation);
                        updateLastViewedByMember(currentConversation._id, Date.now());
                    }
                        
                    socket.emit("joinConversation", conversation);
                    setCurrentConversation(conversation);
                }}
                     currentConversation={currentConversation} />
                <CurrentConversation conversation={currentConversation} socket={socket} />
            </div>
        </div>
    );


    async function getUserData() {
        let config = {
            headers: {
            'Authorization': `Bearer ${localStorage.getItem("JWT")}`
            }
        }
        
        let dataPromise = await axios.get(`http://localhost:8080/getUserInfo/${userContext.user._id}`, config).catch(err => {
            console.log("ERROR");
        });
        return dataPromise?.data.userData;
    }
    async function getConversations() {
        let config = {
            headers: {
            'Authorization': `Bearer ${localStorage.getItem("JWT")}`
            }
        }
        
        let dataPromise = await axios.get(`http://localhost:8080/getUserConversations/${userContext.user._id}`, config).catch(err => {
            console.log("ERROR");
        });

        return dataPromise?.data.conversations;
    }
    function updateLastViewedByMember(conversationID, newTime) {
        let config = {
            headers: {
            'Authorization': `Bearer ${localStorage.getItem("JWT")}`
            }
        }
        axios.post(`http://localhost:8080/updateLastViewedByMember/${conversationID}`,
         { user: userContext.user, newTime: newTime },
         config ).then(() => {
            // console.log("Successfully updated time");
         });
    }
    function setUp() {
        console.log("Sending network requests...");
        getUserData().then(res => {
            // if(!res) {
            //     navigate('/login');
            // }
            // userContext.setUser(res);
            setUserData(res);
        });
        getConversations().then(res => {
            setConversations(res);
        });
    }
}