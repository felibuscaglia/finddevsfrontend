import React, { useState } from 'react';
import style from './PopUpStyle.module.css';
import Popup from 'reactjs-popup';
import axios from 'axios';
import randomColor from 'randomcolor';
import { getBrightness } from '../../utils';

function RegisterPopUp({ isHomepage, isMain, isMainHomepage, isJobProfile }) {

    const [input, setInput] = useState({});
    const [showPass, setShowPass] = useState(false);
    const [errors, setErrors] = useState({});
    const [disabled, setDisabled] = useState(false);

    function handleInputChange(e) {
        if (e.target.name === 'email') {
            if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(e.target.value))) {
                setErrors({ ...errors, email: 'Please enter a valid email.' });
                setDisabled(true);
            } else {
                setErrors({ ...errors, email: false });
                setDisabled(false);
            }
        }
        if (e.target.name === 'username' && errors.username) {
            setErrors({ ...errors, username: false });
            setDisabled(false);
        }
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    function handleSubmit() {
        input.color = randomColor();
        input.brightness = getBrightness(input.color);
        input.profilePic = 'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png';
        axios.post('/auth/register', input)
            .then(res => {
                localStorage.setItem('user', JSON.stringify(res.data));
                window.location.replace('/edit/user/me');
            })
            .catch(err => {
                setErrors({ ...errors, username: 'Username already taken', email: 'A user with this email already exists.' });
                setDisabled(true);
            })
    }

    function closePopUp(close) {
        setErrors({});
        setDisabled(false);
        setInput({});
        close();
    }

    return (
        <Popup trigger={
            isJobProfile ? <button id={style.applyBtn}>Apply to this job</button> : 
            isMain ? <button className={style.btn}>Post your startup.</button> :
                isMainHomepage ? <button id={style.joinBtn}>Join FindDevs for free.</button> :
                    isHomepage ?
                        <span className={style.headerIcon}>join</span> :
                        <span id={style.nonHomepage}>Join FindDevs</span>
        } modal>
            {close => (
                <div>
                    <div id={style.mainDiv}>
                        <div id={style.form}>
                            <button id={style.closeBtn} onClick={() => closePopUp(close)}><i class="fas fa-times"></i></button>
                            <h1 id={style.title}>Sign Up</h1>
                            <span style={{ width: '85%' }}>Join <span className='font800'>FindDevs</span> today and get the boost your startup needs.</span>
                            <div className={errors['username'] ? style.inputcontainerError : style.inputcontainer}>
                                <input value={input.fullName} name='username' className={style.input} placeholder='Your username' onChange={(e) => handleInputChange(e)}></input>
                            </div>
                            {errors['username'] && <span id={style.alertSpan}>{errors['username']}</span>}
                            <div className={errors['email'] ? style.inputcontainerError : style.inputcontainer}>
                                <input value={input.email} name='email' className={style.input} placeholder='Email' onChange={(e) => handleInputChange(e)}></input>
                            </div>
                            {errors['email'] && <span id={style.alertSpan}>{errors['email']}</span>}
                            <div className={errors['email'] ? style.inputcontainerError : style.inputcontainer} className={style.inputcontainer}>
                                <input value={input.password} name='password' type={showPass ? 'text' : 'password'} className={style.input} placeholder='Password' onChange={(e) => handleInputChange(e)}></input>
                                <button id={style.showPassBtn} onClick={() => setShowPass(!showPass)}>{showPass ? 'Hide' : 'Show'}</button>
                            </div>
                            {errors['password'] && <span id={style.alertSpan}>{errors['password']}</span>}
                            <button disabled={!input.username || !input.password || !input.email || disabled ? true : false} id={style.createBtn} onClick={() => handleSubmit()} >Create your account.</button>
                        </div>
                    </div>
                </div>
            )}
        </Popup>
    )
}


export default RegisterPopUp