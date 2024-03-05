import { VscAccount } from "react-icons/vsc";

export default function UsersListItem({ user, addUser }) {



    return(
        <div className="usersListItem" onClick={() => {
            addUser(user);
        }}>
            <VscAccount /> {user.email}
        </div>
    )
}