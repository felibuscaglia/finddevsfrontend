import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import style from './PopUpStyle.module.css';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';


function LoginPopUp({ isRegister }) {

    const [input, setInput] = useState({});
    const [error, setError] = useState(false);
    const [showPass, setShowPass] = useState(false);


    function handleInputChange(e) {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    function handleSubmit() {
        axios.post('/auth/login', input)
            .then(res => {
                const user = jwt.decode(res.data);
                localStorage.setItem('user', JSON.stringify(res.data));
                window.location.replace(`/user/${user.username}`)
            })
            .catch(err => setError(true))
    }

    function closePopUp(close) {
        setInput({});
        setError(false);
        close();
    }

    return (
        <Popup trigger={isRegister ? <span className='mainColor'>Log in</span> : <span className={style.headerIcon}>Login</span>} modal>
            {close => (
                <div id={style.mainDiv}>
                    <div id={style.form}>
                        <button id={style.closeBtn} onClick={() => closePopUp(close)}><FontAwesomeIcon icon={faTimes} /></button>
                        <h1 id={style.title}>Login</h1>
                        <span style={{ width: '85%' }}>Sign into your account here.</span>
                        <div className={error ? style.inputcontainerError : style.inputcontainer}>
                            <FontAwesomeIcon icon={faUser} />
                            <input name='username' onChange={(e) => handleInputChange(e)} className={style.input} placeholder='Your username'></input>
                        </div>
                        <div className={error ? style.inputcontainerError : style.inputcontainer} tabindex="-1">
                            <FontAwesomeIcon icon={faLock} />
                            <input style={{ marginLeft: '10px' }} name='password' type={showPass ? 'text' : 'password'} onChange={(e) => handleInputChange(e)} className={style.input} placeholder='Password'></input>
                            <button id={style.showPassBtn} onClick={() => setShowPass(!showPass)}>{showPass ? 'Hide' : 'Show'}</button>
                        </div>
                        <button onClick={handleSubmit} id={style.createBtn}>Sign in.</button>
                    </div>
                    {error &&
                        <Alert id={style.alert} color="danger">
                            Username or password not valid.
                        </Alert>
                    }
                </div>
            )}
        </Popup>
    )
}

export default LoginPopUp;