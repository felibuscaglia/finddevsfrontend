import React from 'react';
import style from './JobListings.module.css';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { getDate } from '../../utils';
import ApplicantsPopUp from '../../Components/ApplicantsPopUp/ApplicantsPopUp';
import axios from 'axios';

function JobCardProfile({ job, project, isJobPanel }) {

    function deleteJob() {
        axios.delete(`/jobs/${job.id}`)
            .then(window.location.reload())
            .catch(err => console.log(err))
    }

    return (
        <div id={!isJobPanel ? style.mainDivProfile : style.mainDivJP} style={{ background: project.mainColor, color: project.brightness === 'bright' ? '#fff' : '#000' }}>
            <div className='displayFlex' id='alignItemsCenter'>
                <div id={style.imgDiv}><img alt="Project logo" src={project.logo} id={style.icon} /></div>
                <div id={style.jobInfoDiv}>
                    <span id={style.projectName}>{project.name}</span>
                    <span>{job.title}</span>
                </div>
            </div>
            <div id={style.skillDiv}>
                {job.skills.map(skill =>
                    <div style={{ border: project.brightness === 'bright' ? '2px solid #fff' : '2px solid #000' }} key={skill.id} id={style.skillSpan}>{skill.label}</div>
                )}
            </div>
            {!isJobPanel ? 
            <div id={style.applyDiv}>
                <Link to={`/job/info/${job.id}`}><button id={style.btn}>Apply</button></Link>
                <span id={style.pinned}>📌{getDate(moment(job.createdAt).format('MM/DD/YYYY'))}</span>
            </div> :
                <div id={style.applicantsDiv}>
                    <ApplicantsPopUp job={job} projectLogo={project.logo} projectName={project.name} brightness={project.brightness} />
                    <span onClick={deleteJob} style={{ color: project.brightness === 'bright' ? '#000' : '#fff', background: project.brightness === 'bright' ? '#fff' : '#000' }} id={style.editBtn}>Delete</span>
                </div>
            }
        </div>
    )
}

export default JobCardProfile;