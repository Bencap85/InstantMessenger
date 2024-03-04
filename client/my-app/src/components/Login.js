import { state, useState, useContext } from 'react';
import { UserContext } from '../UserWrapper';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Login() {
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ loginSuccessful, setLoginSuccessful ] = useState(true);

    const userContext = useContext(UserContext);
    const navigate = useNavigate();

    function send() {
        let data = { username: username, 
                     password: password };

        axios.post('http://localhost:8080/login', data).then(res => {
            
            if(res.status.toString().split('')[0] === '5') {
                alert("Oops, there was an error. The server may be down. Please try again later");
                return;
            } else if(res.status.toString().split('')[0] === '4') {
                setLoginSuccessful(false);
                return;
            } 

            userContext.setJWT(res.data.token);
            userContext.setUser(res.data.user);

            navigate('/home', { state: { user: { username: res.data.user.username, password: res.data.user.password, authorized: true } } })

        }).catch(err => {
            setLoginSuccessful(false);
        });
        
    }

    return(
        <div className="loginClass">
            <div>
                <h2 className="loginLabel">Login</h2>
                <label>Username</label>
                <input type='text' onChange={(e) => {
                    setUsername(e.target.value);
                }} placeholder='Username...'/>
            </div>
            <div>
                <label>Password</label>
                <input type='text' onChange={(e) => {
                    setPassword(e.target.value);
                }} placeholder='Password...'/>
            </div>

            <button onClick={() => {
                console.log(username);
                send();
            }}>Submit</button>

            {loginSuccessful? null : <p>No account was found with those credentials</p>}

        </div>
    )
}