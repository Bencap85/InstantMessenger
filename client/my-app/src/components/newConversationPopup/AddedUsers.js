import '../../App.css';
import UsersListItem from './UsersListItem.js';

export default function AddedUsers({ users, removeUser }) {
    return(
        <div className="addedUsers">
            <span className="addedUsersText">Added Users</span>
            {users.map(user => {
                return <UsersListItem user={user} addUser={() => removeUser(user)} />
            })}
        </div>

    )
}