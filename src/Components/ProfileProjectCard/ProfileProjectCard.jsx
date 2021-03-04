import React from 'react';
import style from './ProfileProjectCard.module.css';
import { Link } from 'react-router-dom';

function ProfileProjectCard({ project, isFounder }) {
    return (
        <div>
            <div style={{ background: project.mainColor, color: project.brightness === 'bright' ? '#fff' : '#000' }} id={style.projectDiv}>
                <div className='displayFlexColumn' id='alignItemsCenter'>
                    <div id={style.logoDiv}><img alt="Project logo" src={project.logo} id={style.icon} /></div>
                    <h5 id={style.projectName}>{project.name}</h5>
                    {!isFounder && <span id={style.lowEnphasis}>{project.userXprojects.role}</span>}
                    <span id={style.timeSpan}>{project.userXprojects.startDate} — {project.userXprojects.endDate ? project.userXprojects.endDate : 'present'}</span>
                </div>
                <Link to={`/project/profile/${project.id}`}>
                    <button style={{ color: project.brightness === 'bright' ? '#fff' : '#000', border: project.brightness === 'bright' ? '2px solid #fff' : '2px solid #000' }} id={style.contactBtn}>Go to profile</button>
                </Link>
            </div>
        </div>
    )
}

export default ProfileProjectCard;