import React, { useLayoutEffect, useState } from 'react';
import style from './EditUser.module.css';
import { connect } from 'react-redux';
import Verified from '../../Media/Verification.png';
import GoPremium from '../../Components/GoPremiumPopUp/GoPremium';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import { Hint } from 'react-autocomplete-hint';
import Loading from '../../Media/Loading.gif';
import { BlockPicker } from 'react-color';
import axios from 'axios';
import { getBrightness } from '../../utils';
import jwt from 'jsonwebtoken';
import { setUserInfo } from '../../Actions/index';
import { Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPortrait, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faGithubSquare, faLinkedin, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';

function EditUser({ user, skills, setUserInfo }) {

    const [input, setInput] = useState({
        email: user.email,
        color: user.color,
        gitHub: user.gitHub,
        linkedIn: user.linkedIn,
        twitter: user.twitter,
        description: user.description,
        country: user.country,
        region: user.region
    });
    const [preview, setPreview] = useState(user.profilePic);
    const [selectedSkills, setSelectedSkills] = useState();
    const [errors, setErrors] = useState({});
    const [file, setFile] = useState(null);
    const [btnDisabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

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
        setPreview(user.profilePic);
        setInput({
            email: user.email,
            color: user.color,
            gitHub: user.gitHub,
            linkedIn: user.linkedIn,
            twitter: user.twitter,
            description: user.description,
            country: user.country,
            region: user.region
        })
        setSelectedSkills(user.skills);
        setLoading(false)
    }, [user])

    function check(e) {
        setFile(e.target.files[0]);
        setPreview(URL.createObjectURL(e.target.files[0]));
    }

    function addSkill(e) {
        if (e.keyCode === 13) {
            var found = skills.find(skill => skill.label.toLowerCase() === e.target.value.toLowerCase());
            var found2 = selectedSkills.find(skill => skill.label.toLowerCase() === e.target.value.toLowerCase());
            if (found && !found2) {
                setSelectedSkills(selectedSkills.concat(found));
                e.target.value = '';
            }
        }
    }

    function removeSkill(e) {
        setSelectedSkills(selectedSkills.filter(skill => skill.label !== e.target.name))
    }

    function handleInputChange(e) {
        var copyOfErrors = errors;
        var noErrors = true;
        if (e.hex) return setInput({ ...input, color: e.hex });
        if (e.target.name === 'email') {
            if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(e.target.value)) copyOfErrors = { ...copyOfErrors, email: true };
            else copyOfErrors = { ...copyOfErrors, email: false };
        }
        if (e.target.name === 'gitHub' || e.target.name === 'linkedIn' || e.target.name === 'twitter') {
            if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(e.target.value)) copyOfErrors = { ...copyOfErrors, [e.target.name]: true };
            else copyOfErrors = { ...errors, [e.target.name]: false };
        }

        for (const key in copyOfErrors) if (copyOfErrors[key]) noErrors = false;

        if (noErrors) setDisabled(false);
        else setDisabled(true);

        setErrors(copyOfErrors);

        setInput({ ...input, [e.target.name]: e.target.value })
    }

    function handleSubmit() {
        setLoading(true);
        input.brightness = getBrightness(input.color);
        const filteredSkills = selectedSkills.map(skill => skill.id);
        input.skills = filteredSkills;
        axios.put(`/users/${user.id}`, input)
            .then(res => {
                if (file) {
                    const newForm = new FormData();
                    newForm.append('image', file);
                    const config = {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    };
                    return axios.post(`/users/${user.id}/profilePic`, newForm, config);
                } else {
                    window.location.replace(`/user/${user.username}`)
                }
            })
            .then(res => window.location.replace(`/user/${user.username}`))
            .catch(err => {
                setError(true);
                setLoading(false);
            })
    }

    return (
        <div className='displayFlexColumn' id='alignItemsCenter'>
            <div style={{ background: user.color }} id={style.mainImage}>
                <h1 style={{ color: user.brightness === 'bright' ? '#fff' : '#000' }} className='font800'>Edit your profile</h1>
            </div>
            <div id={style.container}>
                {!loading && <div id={style.form}>
                    <div className='displayFlex' id='alignItemsCenter'>
                        <h2 className='font800'>@{user.username}</h2>
                        {user.isPremium && <img alt="Verification badge" id={style.verification} src={Verified} />}
                    </div>
                    <div style={{ display: user.isPremium ? 'none' : 'flex' }} id={style.GPdiv}>
                        <span className='font800'>Verify your FindDevs account and access all the benefits!</span>
                        <GoPremium />
                    </div>
                    <div className='displayFlexColumn' id='alignItemsCenter'>
                        <div id={style.firstDiv} className='displayFlex'>
                            <div id={style.imageDiv}>
                                <div style={{ backgroundImage: `url(${preview})` }} id={style.profilePic}></div>
                                <label for={style.fileDrop} id={style.logoLabel}><FontAwesomeIcon icon={faPortrait} /> Upload Image</label>
                                <input onChange={(e) => check(e)} id={style.fileDrop} type='file' />
                                <BlockPicker onChange={(e) => handleInputChange(e)} color={input.color} />
                            </div>
                            <div id={style.innerFirstDiv}>
                                <div className={style.inputDiv}>
                                    <span className='font800'>Your email</span>
                                    <span id={style.lowEnphasis}>Keep in mind that it will be the one through which startups will contact you.</span>
                                    <input name='email' style={{ border: errors.email ? '2px solid red' : '2px solid #e7e7e7' }} value={input.email} onChange={(e) => handleInputChange(e)} className={style.biggerInput}></input>
                                    {errors.email && <span className={style.errors}>Please enter a valid email.</span>}
                                </div>
                                <div>
                                    <span className='font800'>Where are you based?</span>
                                    <div>
                                        <CountryDropdown className={style.dropdown} value={input.country} onChange={(val) => setInput({ ...input, country: val })} />
                                        <RegionDropdown className={style.dropdown} country={input.country} value={input.region} onChange={(val) => setInput({ ...input, region: val })} />
                                    </div>
                                </div>
                                <div className={style.inputDiv}>
                                    <span className='font800'>Your bio</span>
                                    <textarea name='description' value={input.description} onChange={(e) => handleInputChange(e)} maxLength='255' className={style.textarea}></textarea>
                                </div>
                            </div>
                        </div>
                        <h3 className='font800' id='giveMargin'>Social profiles</h3>
                        <div id={style.socialDiv}>
                            <div className='displayFlexColumn' id='alignItemsCenter'>
                                <span className='font800'><FontAwesomeIcon icon={faGithubSquare} /> GitHub</span>
                                <input style={{ border: errors.gitHub ? '2px solid red' : '2px solid #e7e7e7' }} value={input.gitHub} name='gitHub' onChange={(e) => handleInputChange(e)} className={style.input} />
                                {errors.gitHub && <span className={style.errors}>Please enter a valid URL.</span>}
                            </div>
                            <div className='displayFlexColumn' id='alignItemsCenter'>
                                <span className='font800'><FontAwesomeIcon style={{ color: '#0e76a8' }} icon={faLinkedin} /> LinkedIn</span>
                                <input style={{ border: errors.linkedIn ? '2px solid red' : '2px solid #e7e7e7' }} value={input.linkedIn} name='linkedIn' onChange={(e) => handleInputChange(e)} className={style.input} />
                                {errors.linkedIn && <span className={style.errors}>Please enter a valid URL.</span>}
                            </div>
                            <div className='displayFlexColumn' id='alignItemsCenter'>
                                <span className='font800'><FontAwesomeIcon style={{ color: ' #00acee' }} icon={faTwitterSquare} /> Twitter</span>
                                <input style={{ border: errors.twitter ? '2px solid red' : '2px solid #e7e7e7' }} value={input.twitter} name='twitter' onChange={(e) => handleInputChange(e)} className={style.input} />
                                {errors.twitter && <span className={style.errors}>Please enter a valid URL.</span>}
                            </div>
                        </div>
                        <h3 className='font800' id='giveLessMargin'>Your skills</h3>
                        <div className='displayFlexColumn' id='alignItemsCenter'>
                            <div id={style.skillDiv} className='displayFlex'>
                                {selectedSkills && selectedSkills.map(skill =>
                                    <div key={skill.id}>
                                        <button style={{ background: skill.strongColor, color: skill.softColor }} name={skill.label} onClick={(e) => removeSkill(e)} id={style.skillBtn}><FontAwesomeIcon icon={faTimesCircle} /> {skill.label}</button>
                                    </div>
                                )}
                            </div>
                            <Hint options={skills}>
                                <input onKeyDown={(e) => addSkill(e)} style={{ margin: '0px' }} className={style.input} placeholder='Press enter to add a skill' />
                            </Hint>
                        </div>
                    </div>
                    <div id={style.btnDiv}>
                        <button onClick={() => window.location.replace(`/user/${user.username}`)} style={{ background: 'black', color: 'white' }} id={style.btn}>Discard changes</button>
                        <button onClick={handleSubmit} disabled={btnDisabled} style={{ background: btnDisabled ? 'gray' : user.color, color: user.brightness === 'bright' ? '#fff' : '#000' }} id={style.btn}>Save changes</button>
                    </div>
                    {error && <Alert id='giveMargin' className='font800' color="danger">
                        Something failed — we are sorry!
                    </Alert>}
                </div>}
                {loading &&
                    <div id={style.form}>
                        <img alt="Loading GIF" src={Loading} />
                    </div>}
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        user: state.userInfo,
        skills: state.allSkills
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setUserInfo: username => setUserInfo(username)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUser);