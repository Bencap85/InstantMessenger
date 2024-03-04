import Login from '../components/Login';
import SignUp from '../components/SignUp';
import Header from '../components/Header';

export default function LoginPage() {
    return(
        <div className="loginPageWrapper">
            <Header />
            <div className="loginWrapper">
                <Login  />
                <SignUp  />
            </div>
        </div>
    )
}
