import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import style from './PopUpStyle.module.css';
import axios from 'axios';
import jwt from 'jsonwebtoken';

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
        <Popup trigger={isRegister ? <span className='mainColor'>Log in</span> : <span className={style.headerIcon}>login</span>} modal>
            {close => (
                <div id={style.mainDiv}>
                    <div id={style.form}>
                        <button id={style.closeBtn} onClick={() => closePopUp(close)}><i class="fas fa-times"></i></button>
                        <h1 id={style.title}>Login</h1>
                        <span style={{ width: '85%' }}>Sign into your account here.</span>
                        <div className={error ? style.inputcontainerError : style.inputcontainer}>
                            <i class="far fa-user"></i>
                            <input name='username' onChange={(e) => handleInputChange(e)} className={style.input} placeholder='Your username'></input>
                        </div>
                        <div className={error ? style.inputcontainerError : style.inputcontainer} tabindex="-1">
                            <i class="fas fa-lock"></i>
                            <input style={{ marginLeft: '10px' }} name='password' type={showPass ? 'text' : 'password'} onChange={(e) => handleInputChange(e)} className={style.input} placeholder='Password'></input>
                            <button id={style.showPassBtn} onClick={() => setShowPass(!showPass)}>{showPass ? 'Hide' : 'Show'}</button>
                        </div>
                        <button onClick={handleSubmit} id={style.createBtn}>Sign in.</button>
                    </div>
                    {error &&
                        <div id={style.alert} class="alert alert-danger" role="alert">
                            Username or password not valid.
                        </div>
                    }
                </div>
            )}
        </Popup>
    )
}

export default LoginPopUp;