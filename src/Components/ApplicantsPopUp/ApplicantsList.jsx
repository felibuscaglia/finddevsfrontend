import React, { useState } from 'react';
import style from './ApplicantsPopUp.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loading from '../../Media/Loading.gif';
import Empty from '../../Media/JobApplicants.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheckCircle, faAddressCard, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faGithubSquare, faLinkedin, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';

function ApplicantsList({ job, projectName, applicants, close, setDecided, setApplicants, projectLogo }) {

    const [loading, setLoading] = useState(false);

    function acceptApplicant(applicantName) {
        var message = `🎉 You are now part of ${projectName}! 🎉`;
        setLoading(true);

        axios.post(`/users/${applicantName}/project/${job.projectId}`, { jobTitle: job.title })
            .then(res => {
                return axios.post(`/users/${applicantName}/notifications`, { content: message, type: 'Acceptance', projectId: job.projectId, projectLogo: projectLogo })
            })
            .then(res => axios.delete(`/jobs/${job.id}`))
            .then(res => {
                setLoading(false);
                setDecided(applicantName);
                setTimeout(() => {
                    close()
                    window.location.reload()
                }, 3000);
            })
            .catch(err => console.log(err))
    }

    function rejectApplicant(applicantName) {
        axios.delete(`/jobs/${job.id}/applicants`, { data: { username: applicantName }})
            .then(res => {
                const filteredApplicants = applicants.filter(applicant => applicant.username !== applicantName);
                setApplicants(filteredApplicants);
            })
            .catch(err => console.log(err))
    }

    return (
        !loading ?
            <div id={style.form}>
                <button id={style.closeBtn} onClick={close}><FontAwesomeIcon icon={faTimes} /></button>
                <h1 className='font200'>{job.title}</h1>
                <div className='displayFlex'>
                    {job.skills.map(skill =>
                        <span key={skill.id} style={{ background: skill.strongColor, color: skill.softColor }} className={style.requirement}>{skill.label}</span>
                    )}
                </div>
                <div id={style.topApplicantDiv}>
                    {applicants.map(applicant =>
                        <div key={applicant.id} id={style.applicantDiv}>
                            <div className='displayFlex' id='alignItemsCenter'>
                                <div id={style.profilePic}></div>
                                <span id={style.username}>{`@ ${applicant.username}`}</span>
                                <button style={{ color: 'green' }} onClick={() => acceptApplicant(applicant.username)} className={style.dropdownBtn}><FontAwesomeIcon icon={faCheckCircle} /></button>
                                <button style={{ color: 'red' }} onClick={() => rejectApplicant(applicant.username)} className={style.dropdownBtn}><FontAwesomeIcon icon={faTimesCircle} /></button>
                            </div>
                            <div id={style.socialMediaDiv}>
                                <Link to={`/user/${applicant.username}`}><FontAwesomeIcon style={{ color: applicant.color }} icon={faAddressCard} /></Link>
                                {applicant.gitHub && <a target='blank' rel="noreferrer" href={applicant.gitHub} style={{ textDecoration: 'none', color: applicant.color }}><FontAwesomeIcon icon={faGithubSquare} /></a>}
                                {applicant.linkedIn && <a target='blank' rel="noreferrer" href={applicant.linkedIn} style={{ textDecoration: 'none', color: applicant.color }}><FontAwesomeIcon icon={faLinkedin} /></a>}
                                {applicant.twitter && <a target='blank' rel="noreferrer" href={applicant.twitter} style={{ textDecoration: 'none', color: applicant.color }}><FontAwesomeIcon icon={faTwitterSquare} /></a>}
                            </div>
                        </div>
                    )}
                </div>
                {applicants.length === 0 && 
                <div id={style.emptyDiv}>
                    <img alt='No developers have applied to this job.' id={style.empty} src={Empty} />
                    <Link to='/workers'><button id='btn' style={{ background: 'black' }}>Search for developers</button></Link>
                </div>}
            </div> :
            <div id={style.form}>
                <img alt='Loading GIF' id='icon' src={Loading} />
            </div>
    )
}

export default ApplicantsList;