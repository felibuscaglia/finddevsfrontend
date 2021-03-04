import React, { useState, useLayoutEffect } from 'react';
import style from './AddJob.module.css';
import axios from 'axios';
import { Hint } from 'react-autocomplete-hint';
import { connect } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import Loading from '../../Media/Loading.gif';
import jwt from 'jsonwebtoken';
import { setUserInfo } from '../../Actions/index';
import { Link } from 'react-router-dom';

function AddJob({ projectID, skills, setUserInfo, user }) {

    const [project, setProject] = useState({});
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [input, setInput] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    async function asyncUseEffect(username, userId) {
        await (setUserInfo(username));
        try {
            const projectData = await axios.get(`/projects/${projectID}`);
            const userFound = await projectData.data.users.find(member => member.id === userId);
            if (!userFound || userFound.userXprojects.isFounder === false || projectData.data.isDeleted) window.location.replace('/error');
            setProject(projectData.data);
            setTimeout(() => {
                setLoading(false);
            }, 1000)
        } catch (err) {
            console.log(err)
        }
    }

    useLayoutEffect(() => {
        const user = jwt.decode(JSON.parse(localStorage.getItem('user')))
        if (user) {
            asyncUseEffect(user.username, user.id);
        } else window.location.replace('/error');
    }, [])

    function removeSkill(e) {
        setSelectedSkills(selectedSkills.filter(skill => skill.label !== e.target.name))
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

    function handleInputChange(e) {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    function handleDescriptionChange(e) {
        setInput({
            ...input,
            description: e.target.getContent()
        })
    }

    function handleSubmit() {
        setLoading(true);
        const justIDs = selectedSkills.map(skill => skill.id);

        if (!input.title || !input.description) return setError('Please complete all the necessary fields.')

        axios.post(`/jobs/${project.id}`, { jobInfo: input, skills: justIDs })
            .then(res => window.location.replace(`/project/jobPanel/${project.id}`))
            .catch(err => setError('Something failed—we are sorry!'))
    }

    return (
        <div>
            <div id={style.fixedDiv}>
                <div id={style.logoDiv}>
                    <Link to={`/project/profile/${projectID}`}><img alt="Project logo" src={project.logo} id={style.logo} /></Link>
                </div>
                <Link id={style.link} to={`/project/jobPanel/${projectID}`}><span className='font200'><i class="fas fa-door-open"></i> Go back</span></Link>
            </div>
            <div id={style.secondDiv}>
                {!loading ?
                    <div id={style.innerDiv}>
                        <h1 id={style.mainSpan} className='font800'>Post a job</h1>
                        <div className='displayFlexColumn'>
                            <span className='font600'>Title *</span>
                            <input maxLength='255' name='title' onChange={(e) => handleInputChange(e)} className={style.input} />
                        </div>
                        <div className='displayFlexColumn'>
                            <span className={style.title}>Description *</span>
                            {window.innerWidth > 385 && <Editor
                                onChange={(e) => handleDescriptionChange(e)}
                                apiKey='5ltasngibqdlae7csndk86vmlye4eqd8jhk6fsiza0lpz5db'
                                init={{
                                    selector: 'textarea',
                                    content_style:
                                        "@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;600;700;800;900&display=swap'); body { font-family: 'Nunito';}",
                                    branding: false,
                                    height: 300,
                                    width: 723,
                                    menubar: false,
                                    plugins: [
                                        'advlist autolink lists link image',
                                        'charmap print preview anchor help',
                                        'searchreplace visualblocks code',
                                        'insertdatetime media table paste wordcount',
                                    ],
                                    toolbar:
                                        'undo redo | formatselect | bold italic | \
                            alignleft aligncenter alignright | \
                            bullist numlist outdent indent'
                                }}
                            />}
                            <textarea id={style.textarea} placeholder='Describe your project'></textarea>
                        </div>
                        <div id={style.skillDiv}>
                            <span className='font600'>Skills</span>
                            <div id={style.selectedSkills}>
                                {selectedSkills.map(skill =>
                                    <div key={skill.id}>
                                        <button style={{ background: skill.strongColor, color: skill.softColor }} name={skill.label} onClick={(e) => removeSkill(e)} id={style.skillBtn}>{skill.label}</button>
                                    </div>
                                )}
                            </div>
                            <Hint options={skills}>
                                <input onKeyDown={(e) => addSkill(e)} className={style.inputSkill} placeholder='Press enter to add a skill' />
                            </Hint>
                            <span className='advert'>If you don't find your skill, please contact us.</span>
                        </div>
                        <div>
                            <button onClick={handleSubmit} id={style.uploadBtn}>Post job</button>
                            {error &&
                                <div id={style.alert} class="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            }
                        </div>
                    </div> :
                    <img alt="Loading GIF" className={style.loading} src={Loading} />}
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        skills: state.allSkills,
        user: state.userInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setUserInfo: username => dispatch(setUserInfo(username))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddJob);