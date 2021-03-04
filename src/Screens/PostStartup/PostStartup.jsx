import React, { useState, useLayoutEffect } from 'react';
import Logo from '../../Media/invertedlogo.png';
import style from './PostStartup.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { BlockPicker } from 'react-color';
import { getBrightness } from '../../utils';
import Loading from '../../Media/Loading.gif';
import { setUserInfo } from '../../Actions/index';
import jwt from 'jsonwebtoken';

function PostStartup({ user, limitOfPosts, setUserInfo }) {
    const [input, setInput] = useState({ mainColor: '#000' });
    const [preview, setPreview] = useState('https://i.ibb.co/m82SNJT/profile-pic-startup-sin-marco.png');
    const [file, setFile] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [firstCheck, setFirstCheck] = useState(true);
    const [inputErrors, setInputErrors] = useState({});
    const [btnDisabled, setDisabled] = useState(false);

    async function asyncUseEffect(username) {
        await (setUserInfo(username));
    }

    useLayoutEffect(() => {
        if (!user.username) {
            const user = jwt.decode(JSON.parse(localStorage.getItem('user')))
            if (user) {
                asyncUseEffect(user.username);
            } else window.location.replace('/error');
        }
        if (limitOfPosts) window.location.replace('/error');
        setTimeout(() => {
            setFirstCheck(false);
        }, 2000)
    }, [limitOfPosts])

    function handleInputChange(e) {
        var copyOfErrors = inputErrors;
        var noErrors = true;

        if (e.hex) return setInput({ ...input, mainColor: e.hex });

        if (e.target.name === 'website' || e.target.name === 'workZone' || e.target.name === 'productHunt' || e.target.name === 'twitter' || e.target.name === 'linkedIn') {
            if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(e.target.value)) copyOfErrors = { ...copyOfErrors, [e.target.name]: true };
            else copyOfErrors = { ...copyOfErrors, [e.target.name]: false }
        }

        for (const key in copyOfErrors) if (copyOfErrors[key]) noErrors = false;

        if (noErrors) setDisabled(false);
        else setDisabled(true);

        setInputErrors(copyOfErrors);

        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    function handleSubmit() {
        setLoading(true);
        if (!file) input.logo = 'https://i.ibb.co/m82SNJT/profile-pic-startup-sin-marco.png';
        input.isPremium = user.isPremium;
        input.ownerId = user.id;
        input.brightness = getBrightness(input.mainColor);
        axios.post(`/projects/${user.username}`, input)
            .then(res => {
                if (file) {
                    const newForm = new FormData();
                    newForm.append('image', file);
                    const config = {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    };
                    return axios.post(`/projects/${res.data.id}/logo`, newForm, config);
                } else window.location.replace('/admin/panel')
            })
            .then(res => window.location.replace('/admin/panel'))
            .catch(err => setError(true))
    }

    function check(e) {
        setFile(e.target.files[0]);
        setPreview(URL.createObjectURL(e.target.files[0]));
    }

    if (firstCheck) {
        return (
            <img alt="Loading GIF" id={style.firstCheck} src={Loading} />
        )
    }

    return (
        <div className='displayFlex'>
            <div id={style.fixedDiv}>
                <div id={style.logoDiv}>
                    <Link to={`/user/${user.username}`}><img alt="Project logo" src={Logo} id={style.invertedLogo} /></Link>
                </div>
                <Link id={style.link} to={`/admin/panel`}><span className='font200'><i class="fas fa-door-open"></i> Back to Admin Panel</span></Link>
            </div>
            <div id={style.secondDiv}>
                <h1 className='font800'>Let's start.</h1>
                <p className='font200'>
                    Provide the necessary information for developers to fully understand what your project is about. <br />
                    Remember, the more details you provide, the more users will be interested in what you are doing. <br />
                    Don't worry, you can always edit this later! <br />
                </p>
                <div className='displayFlexColumn'>
                    <span className='font600'>Project name *</span>
                    <input maxLength='100' onChange={(e) => handleInputChange(e)} name='name' className={style.input} />
                </div>
                <div className='displayFlexColumn'>
                    <span className='font600'>Logo *</span>
                    <div id={style.profilePicDiv}>
                        <div id={style.profilePic}><img alt="Selected project logo" src={preview} ID={style.logo} /></div>
                        <label for={style.fileDrop} id={style.logoLabel}>
                            <i class="fas fa-cloud-upload-alt"></i> Upload Logo
                        </label>
                        <input onChange={(e) => check(e)} id={style.fileDrop} type='file' />
                    </div>
                </div>
                <div className='displayFlexColumn'>
                    <span style={{ marginBottom: '25px' }} className='font600'>Main color *</span>
                    <BlockPicker onChange={(e) => handleInputChange(e)} color={input.mainColor} triangle={'hide'} />
                </div>
                <div style={{ marginTop: '25px' }} className='displayFlexColumn'>
                    <span className='font600'>Website</span>
                    <input style={{ border: inputErrors.website ? '2px solid red' : '2px solid #e7e7e7' }} maxLength='255' onChange={(e) => handleInputChange(e)} name='website' className={style.input} />
                    {inputErrors.website && <span className={style.errors}>Please enter a valid URL.</span>}
                </div>
                <div className='displayFlexColumn'>
                    <span className='font600'>Work Zone *</span>
                    <span className='advert'>Keep in mind that it will be your team's designated workspace. It can be a link to Slack,<br /> Flowdock or WebEx, for example.</span>
                    <input style={{ border: inputErrors.workZone ? '2px solid red' : '2px solid #e7e7e7' }} maxLength='255' onChange={(e) => handleInputChange(e)} value={input.workZone} name='workZone' className={style.input} />
                    {inputErrors.workZone && <span className={style.errors}>Please enter a valid URL.</span>}
                </div>
                <div id={style.socialDiv}>
                    <div className='displayFlexColumn' id='alignItemsFS'>
                        <span className='font800'><i style={{ color: '#DA552F' }} class="fab fa-product-hunt"></i> Product Hunt</span>
                        <input style={{ border: inputErrors.productHunt ? '2px solid red' : '2px solid #e7e7e7' }} maxLength='255' name='productHunt' onChange={(e) => handleInputChange(e)} className={style.socialMediaInput} />
                        {inputErrors.productHunt && <span className={style.errors}>Please enter a valid URL.</span>}
                    </div>
                    <div className='displayFlexColumn' id='alignItemsFS'>
                        <span className='font800'><i style={{ color: ' #00acee' }} class="fab fa-twitter-square"></i> Twitter</span>
                        <input style={{ border: inputErrors.twitter ? '2px solid red' : '2px solid #e7e7e7' }} maxLength='255' name='twitter' onChange={(e) => handleInputChange(e)} className={style.socialMediaInput} />
                        {inputErrors.twitter && <span className={style.errors}>Please enter a valid URL.</span>}
                    </div>
                    <div className='displayFlexColumn' id='alignItemsFS'>
                        <span className='font800'><i style={{ color: '#0e76a8' }} class="fab fa-linkedin"></i> LinkedIn</span>
                        <input style={{ border: inputErrors.linkedIn ? '2px solid red' : '2px solid #e7e7e7' }} maxLength='255' name='linkedIn' onChange={(e) => handleInputChange(e)} className={style.socialMediaInput} />
                        {inputErrors.linkedIn && <span className={style.errors}>Please enter a valid URL.</span>}
                    </div>
                </div>
                <div className='displayFlexColumn'>
                    <span className='font600'>One-line description *</span>
                    <span className='advert'>Describe your project in just a few words.</span>
                    <input maxLength="100" onChange={(e) => handleInputChange(e)} name='oneLineDescription' className={style.input} />
                </div>
                <div className='displayFlexColumn'>
                    <span className='font600' >Describe your project *</span>
                    <textarea onChange={(e) => handleInputChange(e)} name='description' maxLength="2000" className={style.textarea} />
                </div>
                {error && <div id={style.alert} class="alert alert-danger" role="alert">Please complete all the necessary fields.</div>}
                {loading && !error ? <img alt="Loading GIF" id={style.loading} src={Loading} /> : <button disabled={btnDisabled} onClick={handleSubmit} id={style.uploadBtn}>Post your project!</button>}
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        user: state.userInfo,
        limitOfPosts: state.limitOfPosts
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setUserInfo: username => dispatch(setUserInfo(username))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostStartup);