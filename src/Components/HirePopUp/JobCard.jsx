import React, { useState } from 'react';
import style from './HirePopUp.module.css';
import axios from 'axios';
import Loading from '../../Media/Loading.gif';
import Invited from '../ApplicantsPopUp/Accepted';

function JobCard({ job, project, applicantUsername, user, close, alreadyInvited }) {

    const [invited, setInvited] = useState(false);
    const [loading, setLoading] = useState(false);

    function inviteToProject(jobTitle, jobId) {
        setLoading(true);
        var message = `${jobTitle} at ${project.project.name}`;

        axios.post(`/users/${applicantUsername}/notifications`, { content: message, type: 'Invitation', projectId: project.project.id, jobTitle: jobTitle, projectLogo: project.project.logo, projectName: project.project.name, ownerUsername: user.username, jobId })
            .then(res => {
                setInvited(true);
                setLoading(false);
                setTimeout(() => {
                    close()
                    window.location.reload()
                }, 3000);
            })
            .catch(err => console.log(err))
    }

    if (loading) {
        return (
            <div>
                <img alt="Loading GIF" id={style.loading} src={Loading} />
            </div>
        )
    } else if (invited) {
        return <Invited type={'Invitation'} decided={applicantUsername} projectName={project.project.name} />
    } else return (
        <div id={style.mainJobDiv} style={{ background: project.project.mainColor, color: project.project.brightness === 'bright' ? '#fff' : '#000' }}>
            <div className='displayFlex' id='alignItemsCenter'>
                <span className='font800'>{job.title}</span>
            </div>
            <div id={style.skillDiv}>
                {job.skills.map(skill =>
                    <div key={skill.id} style={{ border: project.project.brightness === 'bright' ? '2px solid #fff' : '2px solid #000' }} id={style.skillSpan}>{skill.label}</div>
                )}
            </div>
            {alreadyInvited ? <span style={{ color: project.project.brightness === 'bright' ? '#fff' : '#000', border: project.project.brightness === 'bright' ? '3px solid white' : '3px solid black' }} id={style.applyBtn} ><i class="fas fa-check-circle"></i></span> : <button onClick={() => inviteToProject(job.title, job.id)} style={{ color: project.project.brightness === 'bright' ? '#fff' : '#000', border: project.project.brightness === 'bright' ? '3px solid white' : '3px solid black' }} id={style.applyBtn}>Invite</button>}
        </div>
    )
}

export default JobCard;