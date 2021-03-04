import React, { useState, useEffect } from 'react';
import style from './PostStartup.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { BlockPicker } from 'react-color';
import { getBrightness } from '../../utils';
import Loading from '../../Media/Loading.gif';
import UserCard from './UserSettingsCard';
import Confirmation from '../../Components/PopUps/Confirmation';
import { setUserInfo } from '../../Actions/index';
import jwt from 'jsonwebtoken';

function ProjectSettings({ user, projectID, setUserInfo }) {

    const [input, setInput] = useState({});
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [firstCheck, setFirstCheck] = useState (true);
    const [inputErrors, setInputErrors] = useState ({});
    const [btnDisabled, setDisabled] = useState (false);

    async function asyncUseEffect(username) {
        await (setUserInfo(username));
    }

    useEffect(() => {
        if (!user.username) {
            const user = jwt.decode(JSON.parse(localStorage.getItem('user')))
            if (user) {
                asyncUseEffect(user.username);
            } else window.location.replace('/error');
        }
        axios.get(`/projects/${projectID}`)
            .then(projectData => {
                const userFound = projectData.data.users.find (member => member.id === user.id);
                if (projectData.data.isDeleted || !userFound || !userFound.userXprojects.isFounder) window.location.replace ('/error'); 
                setPreview(projectData.data.logo)
                setInput(projectData.data);
                setTimeout (() => {
                    setFirstCheck (false);
                }, 2000)
            })
            .catch(err => console.log(err))
    }, [])

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
        input.brightness = getBrightness (input.mainColor);
        axios.patch(`/projects/${projectID}`, input)
            .then(res => {
                if (file) {
                    const newForm = new FormData();
                    newForm.append('image', file);
                    const config = {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    };
                    return axios.post(`/projects/${projectID}/logo`, newForm, config);
                } else return window.location.replace ('/admin/panel')
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
            <img alt="Loading GIF" src={Loading} id={style.firstCheck} />
        )
    }

    return (
        <div className='displayFlex'>
            <div id={style.fixedDiv} >
                <div id={style.logoDivS}>
                    <Link to={`/project/profile/${projectID}`}><img alt="Project logo redirect" src={input.logo} id={style.invertedLogoSettings} /></Link>
                </div>
                <Link id={style.link} to={`/admin/panel`}><span className='font200'><i class="fas fa-door-open"></i> Back to Admin Panel</span></Link>
            </div>
            <div id={style.secondDiv}>
                <h1 className='font800'>Project Settings</h1>
                <div className='displayFlexColumn'>
                    <span className='font600'>Project name *</span>
                    <input value={input.name} maxLength='255' onChange={(e) => handleInputChange(e)} name='name' className={style.input} />
                </div>
                <div className='displayFlexColumn'>
                    <span className='font600'>Logo *</span>
                    <div id={style.profilePicDiv}>
                        <div id={style.profilePic}><img alt="Project logo" src={preview} ID={style.logo} /></div>
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
                    <input style={{ border: inputErrors.website ? '2px solid red' : '2px solid #e7e7e7' }} value={input.website} maxLength='255' onChange={(e) => handleInputChange(e)} name='website' className={style.input} />
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
                        <input style={{ border: inputErrors.productHunt ? '2px solid red' : '2px solid #e7e7e7' }} value={input.productHunt} maxLength='255' name='productHunt' onChange={(e) => handleInputChange(e)} className={style.socialMediaInput} />
                        {inputErrors.productHunt && <span className={style.errors}>Please enter a valid URL.</span>}
                    </div>
                    <div className='displayFlexColumn' id='alignItemsFS'>
                        <span className='font800'><i style={{ color: ' #00acee' }} class="fab fa-twitter-square"></i> Twitter</span>
                        <input style={{ border: inputErrors.twitter ? '2px solid red' : '2px solid #e7e7e7' }} value={input.twitter} maxLength='255' name='twitter' onChange={(e) => handleInputChange(e)} className={style.socialMediaInput} />
                        {inputErrors.twitter && <span className={style.errors}>Please enter a valid URL.</span>}
                    </div>
                    <div className='displayFlexColumn' id='alignItemsFS'>
                        <span className='font800'><i style={{ color: '#0e76a8' }} class="fab fa-linkedin"></i> LinkedIn</span>
                        <input style={{ border: inputErrors.linkedIn ? '2px solid red' : '2px solid #e7e7e7' }} value={input.linkedIn} maxLength='255' name='linkedIn' onChange={(e) => handleInputChange(e)} className={style.socialMediaInput} />
                        {inputErrors.linkedIn && <span className={style.errors}>Please enter a valid URL.</span>}
                    </div>
                </div>
                <div className='displayFlexColumn'>
                    <span className='font600'>One-line description *</span>
                    <span className='advert'>Describe your project in just a few words.</span>
                    <input value={input.oneLineDescription} maxLength="100" onChange={(e) => handleInputChange(e)} name='oneLineDescription' className={style.input} />
                </div>
                <div className='displayFlexColumn'>
                    <span className='font600'>Describe your project *</span>
                    <textarea value={input.description} onChange={(e) => handleInputChange(e)} name='description' maxLength="2000" className={style.textarea} />
                </div>
                <div>
                    {input.users && input.users.map(user => !user.userXprojects.isFounder ? <UserCard key={user.id} user={user} projectID={input.id} /> : null)}
                </div>
                {error && <div id={style.alert} class="alert alert-danger" role="alert">Please complete all the necessary fields.</div>}
                {loading && !error ? <img alt="Loading GIF" id={style.loading} src={Loading} /> :
                    <div id={style.btnDiv}>
                        <button disabled={btnDisabled} onClick={handleSubmit} id={style.uploadBtn}>Update your project</button>
                        <Confirmation project={input} />
                    </div>}
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        user: state.userInfo
    }
}

function mapDispatchToProps (dispatch) {
    return {
        setUserInfo: username => dispatch(setUserInfo(username))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSettings);