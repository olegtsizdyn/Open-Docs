import React from 'react';
import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { ReactComponent as Logo } from '../../shared/images/svg/logo.svg';
import { ReactComponent as Burger } from '../../shared/images/svg/burger.svg';
import { ReactComponent as Search } from '../../shared/images/svg/search.svg';
import { ReactComponent as Close } from '../../shared/images/svg/close.svg';
import * as firebase from 'firebase';
import { connect, useDispatch } from 'react-redux'
import { setLoginState } from '../../store/auth/actions'
import { setNavToggle } from '../../store/nav/actions'
import { NavLink } from 'react-router-dom';

function Header({ auth: { isLogin }, setLoginState, setNavToggle }) {

    const [isActiveSignIn, setIsActiveSignIn] = useState(false);
    const [isActiveSignUp, setIsActiveSignUp] = useState(false);

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useDispatch(setLoginState(true))
            }
        });
    }, [])

    const toggleModalSignIn = () => {
        setIsActiveSignIn(!isActiveSignIn);
        Modal.setAppElement('body');
    }

    const toggleModalSignUp = () => {
        setIsActiveSignIn(false);
        setIsActiveSignUp(!isActiveSignUp);
        Modal.setAppElement('body');
    }

    const [emailSignIn, setEmailSignIn] = useState('');
    const [passwordSignIn, setPasswordSignIn] = useState('');
    const [disableBtn, setDisableBtn] = useState('');

    const signIn = () => {
        setDisableBtn(true);

        firebase.auth().signInWithEmailAndPassword(emailSignIn, passwordSignIn)
            .then(() => setEmailSignIn(''))
            .then(() => setPasswordSignIn(''))
            .then(() => setIsActiveSignIn(false))
            .then(() => console.dir(firebase.auth().currentUser))
            .catch(() => setDisableBtn(false));
    }

    const [emailSignUp, setEmailSignUp] = useState('');
    const [passwordSignUp, setPasswordSignUp] = useState('');

    const signUp = () => {
        setDisableBtn(true);

        firebase.auth().createUserWithEmailAndPassword(emailSignUp, passwordSignUp)
            .then(() => setEmailSignUp(''))
            .then(() => setPasswordSignUp(''))
            .then(() => setIsActiveSignUp(false))
            .then(() => console.dir(firebase.auth().onAuthStateChanged))
            .catch(() => setDisableBtn(false));
    }

    const logOut = () => {
        firebase.auth().signOut().then(function () {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useDispatch(setLoginState(false))
        }).catch(function (error) {
            console.log('error');
        });
        setDisableBtn(false)
    }

    const OpenNav = () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useDispatch(setNavToggle(true))
    }

    return (
        <div className='header'>
            {!isLogin &&
                <NavLink to="/home" className="logo_icon">
                    <Logo />
                </NavLink>
            }
            <div className="serch_input_wrapper">
                {isLogin &&
                    <div className="burger_icon_srapper">
                        <Burger className="burger_icon" onClick={OpenNav} />
                    </div>
                }
                <div className="search_icon_wrapper">
                    <Search className="search_icon" />
                </div>
                <input className="serch_input" type="text" placeholder="Search" />
            </div>
            <div>
                <ul className="menu">
                    <li>About</li>
                    <li>Contact</li>
                    {isLogin &&
                        <li onClick={logOut}>Logout</li>
                    }
                    {!isLogin &&
                        <li onClick={toggleModalSignIn}>Sign In</li>
                    }
                </ul>
            </div>

            {/* Sign In */}
            <Modal isOpen={isActiveSignIn} onRequestClose={toggleModalSignIn} className="modal" overlayClassName="overlay">
                <div className="modal_sign_in_wrapper">
                    <Close onClick={toggleModalSignIn}/>
                    <p onClick={toggleModalSignUp}>Create a free account</p>
                    <div className="modal_content">
                        <h1>Sign In below to upload, share, edit and send documents.</h1>
                        <div className="input_wrapper">
                            <label>Email Address</label>
                            <input type="email" placeholder="Email Address" value={emailSignIn} onChange={(e) => setEmailSignIn(e.target.value)} />
                        </div>
                        <div className="input_wrapper">
                            <span>Password</span>
                            <input type="password" placeholder="Password" value={passwordSignIn} onChange={(e) => setPasswordSignIn(e.target.value)} />
                        </div>
                        <button className={disableBtn ? "sign_in_btn_disabled" : "sign_in_btn"} disabled={disableBtn} onClick={signIn}>Sign In</button>
                    </div>
                </div>
            </Modal>

            {/* Sign Up */}
            <Modal isOpen={isActiveSignUp} onRequestClose={toggleModalSignUp} className="modal" overlayClassName="overlay">
                <div className="modal_sign_in_wrapper">
                    <Close onClick={toggleModalSignUp}/>
                    <div className="modal_content sign_up">
                        <h1>Sign Up below to upload, share, edit and send documents.</h1>
                        <div className="input_wrapper">
                            <label>Email Address</label>
                            <input type="email" placeholder="Email Address" value={emailSignUp} onChange={(e) => setEmailSignUp(e.target.value)} />
                        </div>
                        <div className="input_wrapper">
                            <span>Password</span>
                            <input type="password" placeholder="Password" value={passwordSignUp} onChange={(e) => setPasswordSignUp(e.target.value)} />
                        </div>
                        <button className={!disableBtn ? "sign_in_btn" : "sign_in_btn_disabled"} disabled={disableBtn} onClick={signUp}>Sign Up</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

const mapStateToProps = ({ auth, nav }) => {
    return { auth, nav }
}

const mapDispatchToProps = {
    setLoginState,
    setNavToggle
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
