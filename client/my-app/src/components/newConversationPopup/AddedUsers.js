import '../../App.css';
import UsersListItem from './UsersListItem.js';

export default function AddedUsers({ users, removeUser }) {
    return(
        <div className="addedUsers">
            <h2 className="addedUsersText">Added Users</h2>
            {users.map(user => {
                return <UsersListItem user={user} addUser={() => removeUser(user)} />
            })}
        </div>

    )
}