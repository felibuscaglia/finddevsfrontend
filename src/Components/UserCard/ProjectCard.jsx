import React from 'react';
import style from './UserCard.module.css';
import { Link } from 'react-router-dom';
import Verification from '../../Media/Verification.png';

function ProjectCard({ project }) {
    return (
        <div id={style.projectCard}>
            <div id='alignItemsCenter' className='displayFlexColumn'>
                <img alt="Project logo" id={style.profilePic} src={project.logo} />
                <div className='displayFlex' id='alignItemsCenter'>
                    <span id={style.projectName} className='font800'>{project.name}</span>
                    {project.isPremium && <img src={Verification} id={style.verification} />}
                </div>
                <p id={style.bio}>{project.oneLineDescription}</p>
            </div>
            <Link style={{ width: '100%' }} to={`/project/profile/${project.id}`}><button id={style.btn} style={{ background: project.mainColor }}>Go to profile</button></Link>
        </div>
    )
}

export default ProjectCard;