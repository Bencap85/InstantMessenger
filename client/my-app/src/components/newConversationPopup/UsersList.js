import axios from 'axios';
import UsersListItem from './UsersListItem.js'
import { UserContext } from '../../UserWrapper.js';
import { state, useState, useEffect, useContext } from 'react';

export default function UsersList({ addUser }) {

    const userContext = useContext(UserContext);
    const [ users, setUsers ] = useState(null);

    useEffect(() => {
        if(users) {
            return;
        } else {
            getUsersList().then(res => {
                setUsers(res);
            });
        }
        
    }, []);
    
    
    async function getUsersList() {
        let usersList = null;
        let config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("JWT")}`
            }
        }
        usersList = await axios.post('http://localhost:8080/usersList', {}, config).catch(err => {
            console.log(err);
        });
        usersList = usersList.data.usersList;
        usersList = usersList.filter(u => {
            return u._id !== userContext.user._id;
        });
        return usersList;
    }
    
    return(
        <div className="usersList" >
            {users? users.map(user => {
                return <UsersListItem user={user} addUser={addUser} />
            }): null }
        </div>
    )
}