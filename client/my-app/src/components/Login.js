import { state, useState, useContext } from 'react';
import { UserContext } from '../UserWrapper';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Login() {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ loginSuccessful, setLoginSuccessful ] = useState(true);

    const userContext = useContext(UserContext);
    const navigate = useNavigate();

    function send() {
        let data = { email: email, 
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

            navigate('/home', { state: { user: { email: res.data.user.email, password: res.data.user.password, authorized: true } } })

        }).catch(err => {
            setLoginSuccessful(false);
        });
        
    }

    return(
        <div className="loginClass">
            <div>
                <h2 className="loginLabel">Login</h2>
                <label>Email</label>
                <input type='text' onChange={(e) => {
                    setEmail(e.target.value);
                }} placeholder='Email...'/>
            </div>
            <div>
                <label>Password</label>
                <input type='text' onChange={(e) => {
                    setPassword(e.target.value);
                }} placeholder='Password...'/>
            </div>

            <button onClick={() => {
                send();
            }}>Submit</button>

            {loginSuccessful? null : <p>No account was found with those credentials</p>}

        </div>
    )
}