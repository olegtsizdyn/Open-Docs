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
import { reduxForm, Field } from 'redux-form';
import { required } from '../../common/validators';

function Header({ auth: { isLogin }, setLoginState, setNavToggle }) {

    const [isActiveSignIn, setIsActiveSignIn] = useState(false);
    const [isActiveSignUp, setIsActiveSignUp] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                dispatch(setLoginState(true))
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

    const signIn = (data) => {
        firebase.auth().signInWithEmailAndPassword(data.email, data.password)
            .then(() => setIsActiveSignIn(false))
    }

    const signUp = (data) => {
        firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
            .then(() => setIsActiveSignUp(false))
    }

    const logOut = () => {
        firebase.auth().signOut().then(function () {
            dispatch(setLoginState(false))
        }).catch(function (error) {
            console.log('error');
        });
    }

    const OpenNav = () => {
        dispatch(setNavToggle(true))
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

            {/* Sign In Modal */}
            <Modal isOpen={isActiveSignIn} onRequestClose={toggleModalSignIn} className="modal" overlayClassName="overlay">
                <div className="modal_sign_in_wrapper">
                    <Close onClick={toggleModalSignIn} />
                    <p onClick={toggleModalSignUp}>Create a free account</p>
                    <div className="modal_content">
                        <h1>Sign In below to upload, share, edit and send documents.</h1>
                        <ModalFormRedux onSubmit={signIn} />
                    </div>
                </div>
            </Modal>

            {/* Sign Up Modal */}
            <Modal isOpen={isActiveSignUp} onRequestClose={toggleModalSignUp} className="modal" overlayClassName="overlay">
                <div className="modal_sign_in_wrapper">
                    <Close onClick={toggleModalSignUp} />
                    <div className="modal_content sign_up">
                        <h1>Sign Up below to upload, share, edit and send documents.</h1>
                        <ModalFormRedux onSubmit={signUp} />
                    </div>
                </div>
            </Modal>
        </div>
    );
}

const ModalForm = (props) => {
    return (
        <form onSubmit={props.handleSubmit}>
            <div className="input_wrapper">
                <Field name="email" type="email" component={renderField} label="Email Address" placeholder="Email Address" validate={required} />
            </div>
            <div className="input_wrapper">
                <Field name="password" type="password" component={renderField} label="Password" placeholder="Password" validate={required} />
            </div>
            <button>Submit</button>
        </form>
    )
}

const ModalFormContainer = reduxForm({ form: "modalForm" })(ModalForm)

const ModalFormRedux = reduxForm({
    form: 'modalForm'
})(ModalForm)

const renderField = ({
    input,
    label,
    type,
    placeholder,
    meta: { touched }
    }) => (
            <div>
                <label>{label}</label>
                <div>
                    <input {...input} placeholder={placeholder} type={type} className={touched && !input.value ? "error_input" : ""} />
                </div>
            </div>
        )

const mapStateToProps = ({ auth, nav }) => {
    return { auth, nav }
}

const mapDispatchToProps = {
    setLoginState,
    setNavToggle
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
