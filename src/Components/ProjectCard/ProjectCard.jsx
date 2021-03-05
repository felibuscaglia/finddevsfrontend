import React from 'react';
import style from './ProjectCard.module.css';
import MembersPopUp from '../../Components/ApplicantsPopUp/MembersPopUp';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSuitcase, faTerminal, faSlidersH, faBan } from '@fortawesome/free-solid-svg-icons';

function ProjectCard({ project, isFounder, setAlert }) {

    return (
        <div id={style.mainDiv} style={{ background: project.mainColor, color: project.brightness === 'bright' ? '#fff' : '#000' }}>
            <div id={style.firstDiv} >
                <div id={style.imgDiv}><img alt="Project logo" src={project.logo} id={style.icon} /></div>
                <h5 id={style.name} className='font800'>{project.name}</h5>
            </div>
            <div id={style.btnDiv}>
                {isFounder && <Link className='links' to={`/project/jobPanel/${project.id}`}><div style={{ color: project.brightness === 'bright' ? '#fff' : '#000', border: project.brightness === 'bright' ? '2px solid #fff' : '2px solid #000' }} className={style.redirectDiv}><span><FontAwesomeIcon icon={faSuitcase} /> Jobs</span></div></Link>}
                <MembersPopUp isFounder={isFounder} brightness={project.brightness} projectID={project.id} />
                <a href={project.workZone} target='_blank' rel="noreferrer"><div style={{ color: project.brightness === 'bright' ? '#fff' : '#000', border: project.brightness === 'bright' ? '2px solid #fff' : '2px solid #000' }} className={style.redirectDiv}><span><FontAwesomeIcon icon={faTerminal} /> Work Zone</span></div></a>
                <Link className='links' to={`/project/profile/${project.id}`}><div style={{ color: project.brightness === 'bright' ? '#fff' : '#000', border: project.brightness === 'bright' ? '2px solid #fff' : '2px solid #000' }} className={style.redirectDiv}><span>Go to profile</span></div></Link>
                {isFounder && <Link className='links' to={`/project/settings/${project.id}`}><div style={{ color: project.brightness === 'bright' ? '#fff' : '#000', border: project.brightness === 'bright' ? '2px solid #fff' : '2px solid #000' }} className={style.redirectDiv}><span><FontAwesomeIcon icon={faSlidersH} /> Settings</span></div></Link>}
                {!isFounder && <div onClick={() => setAlert ({ name: project.name, id: project.id })} style={{ color: project.brightness === 'bright' ? '#fff' : '#000', border: project.brightness === 'bright' ? '2px solid #fff' : '2px solid #000' }} className={style.redirectDiv}><span><FontAwesomeIcon icon={faBan} /> Leave project</span></div>}
            </div>
        </div>
    )
}

export default ProjectCard;