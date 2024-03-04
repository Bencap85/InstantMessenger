import react from 'react';
import UsersListItem from './UsersListItem.js';
import { state, useState } from 'react';
import '../../App.css';

export default function UsersSearch({ addUser, searchForUsers, results }) {
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
                    return <UsersListItem user={res} addUser={addUser} />;
                }) : null }
            </div>
        </div>
    );
}