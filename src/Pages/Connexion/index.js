import "./index.css";
import Header from "../../Containers/Header";
import Footer from "../../Containers/Footer";
import React, {useState} from "react";
import { useDispatch } from "react-redux";
import {loginUser, fetchUserProfile} from "../../Services/authSlice";
import { useNavigate } from "react-router-dom";

const Page = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError('');
        setPasswordError('');

        dispatch(loginUser({ email, password }))
        .unwrap()
        .then(() => {
            dispatch(fetchUserProfile());
            navigate('/profil');
        })
        .catch((error) => {
            if (error.message.includes('User not found')) {
                setEmailError('Utilisateur incorect');
            } else if (error.message.includes('Password is invalid')) {
                setPasswordError('Mot de passe incorect');
            } else {
                setEmailError('Erreur lié au serveur d\'identification');
            }
        });
    };
    return <>
        <header>
            <Header />
        </header>

        <main>
            <section className="sign-in-content">
                <i className="fa fa-user-circle sign-in-icon"></i>
                <h1>Sign In</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <label htmlFor="email">Username</label>
                        <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        {emailError && <p className="error">{emailError}</p>}
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        {passwordError && <p className="error">{passwordError}</p>}
                    </div>
                    <div className="input-remember">
                        <input type="checkbox" id="remember-me" />
                        <label htmlFor="remember-me">Remember me</label>
                    </div>
                    <button type="submit" className="sign-in-button">Sign In</button>
                </form>
            </section>
        </main>

        <footer>
            <Footer />
        </footer>
    </>
}

export default Page;
