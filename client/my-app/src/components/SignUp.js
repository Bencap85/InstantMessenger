import { state, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserWrapper';

export default function SignUp() {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ signUpSuccessful, setSignUpSuccessful ] = useState(true);

    const navigate = useNavigate();

    const userContext = useContext(UserContext);

    

    return(
        <div className='loginClass'>
            <div>
                <h2>Sign Up</h2>
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
                if(validEmail(email)) {
                    send();
                } else {
                    alert('Please enter a valid email address');
                }
            }}>Submit</button>
            {signUpSuccessful? null : <p>Oops, something went wrong. Please try again</p> }
        </div>
    );
    function send() {  
        let data = { email: email, 
                     password: password };
        
            axios.post('http://localhost:8080/signUp', data).then(res => {
                userContext.setJWT(res.data.token);
                userContext.setUser({ ...res.data.user, isAuthorized: true });

                if(signUpSuccessful) {
                    navigate('/home', { state: { user: { email: res.data.user.email, password: res.data.user.password, authorized: true } } })
                }
            }).catch(err => {
                setSignUpSuccessful(false);
                console.log(err.message);
                
            });
        
    }
    function validEmail(str) {
        const regex = /\w+@{1}\w+.\w+/;
        return regex.test(str);
    }
}