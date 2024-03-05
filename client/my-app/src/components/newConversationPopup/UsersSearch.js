import react from 'react';
import UsersListItem from './UsersListItem.js';
import { state, useState, useContext } from 'react';
import { UserContext } from '../../UserWrapper.js';
import '../../App.css';

export default function UsersSearch({ addUser, searchForUsers, results }) {

    const userContext = useContext(UserContext);
    const [ email, setEmail ] = useState('undefined');

    return(
        <div className="usersSearch">
            <h2>Search for users</h2>
            <input type="text" className="searchBar" placeholder="Email..." onChange={(e) => {
                setEmail(e.target.value);
            }}></input>
            <button className="searchButton" onClick={() => {
                searchForUsers(email);
            }}>Search</button>
            <div className="results">
                {results.length > 0 ? results.map(res => {
                    return res._id !== userContext.user._id ? <UsersListItem user={res} addUser={addUser} /> : null;
                }) : null }
            </div>
        </div>
    );
}