import React, { useEffect, useState } from 'react';
import style from './ProjectProfile.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import JobCard from '../JobListing/JobCardProfile';
import Loading from '../../Media/Loading.gif';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from "@material-ui/core/styles";

function ProjectProfile({ projectID, user }) {

    const [project, setProject] = useState({});
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [loading, setLoading] = useState(true);

    const BlueOnGreenTooltip = withStyles({
        tooltip: {
            color: "white",
            backgroundColor: "#181a19",
            fontFamily: 'Nunito',
            fontSize: '12px'
        },
        arrow: {
            color: "#181a19"
        }
    })(Tooltip);

    useEffect(() => {
        axios.get(`/projects/${projectID}`)
            .then(project => {
                setProject(project.data);
                setLoading(false);
            })
            .catch(err => console.log(err))
    }, [])

    function modifyUpvotes() {
        const updatedUpvotes = { upvotes: project.upvotes + 1 };
        axios.patch(`/projects/${project.id}`, updatedUpvotes)
            .then(res => {
                setProject({ ...project, upvotes: project.upvotes + 1 });
                setHasUpvoted(true);
            })
            .catch(err => console.log(err))
    }

    if (loading) {
        return (
            <img alt="Loading GIF" id={style.loading} src={Loading} />
        )
    }

    return (
        <div className='displayFlexColumn'>
            <div style={{ background: project.mainColor }} id={style.cover}></div>
            <div id={style.presentDiv}>
                <div id={style.socialMediaDiv}>
                    {hasUpvoted || project.isDeleted ? <button style={{ display: project.isDeleted ? 'none' : 'inline', background: project.mainColor, color: project.brightness === 'bright' ? '#fff' : '#000' }} id={style.upvoteBtn}><i class="fas fa-check-circle"></i></button> : <button onClick={modifyUpvotes} style={{ background: project.mainColor, color: project.brightness === 'bright' ? '#fff' : '#000' }} id={style.upvoteBtn}><i class="fas fa-rocket"></i> Upvote | {project.upvotes}</button>}
                    {project.productHunt && <a href={project.productHunt} target='blank' rel="noreferrer" style={{ textDecoration: 'none', color: project.mainColor }}><i class="fab fa-product-hunt"></i></a>}
                    {project.twitter && <a href={project.twitter} target='blank' rel="noreferrer" style={{ textDecoration: 'none', color: project.mainColor }}><i class="fab fa-twitter-square"></i></a>}
                    {project.linkedIn && <a href={project.linkedIn} target='blank' rel="noreferrer" style={{ textDecoration: 'none', color: project.mainColor }}><i class="fab fa-linkedin"></i></a>}
                    {project.website && <a href={project.website} target='blank' rel="noreferrer" style={{ textDecoration: 'none', color: project.mainColor }}><i class="fas fa-globe"></i></a>}
                </div>
                <div id={style.projectLogo}><img alt="Project logo" src={project.logo} id={style.logo} /></div>
                <h1 id={style.projectName}>{project.name} {project.isDeleted && <BlueOnGreenTooltip title='This project has been closed by its founders.' arrow><span id={style.closedSpan}>CLOSED</span></BlueOnGreenTooltip>}</h1>
                <span id={style.oneLineDescription}>{project.oneLineDescription}</span>
            </div>
            <div id={style.aboutDiv} style={{ background: project.mainColor }}>
                <h1 className='font600'>About</h1>
                <p className='font200' style={{ color: project.brightness === 'bright' ? '#fff' : '#000', fontSize: '17px' }}>{project.description}</p>
            </div>
            <div className='displayFlexColumn' id='alignItemsCenter'>
                <h2 className='font800'>Members</h2>
                <div id={style.mainUserDiv}>
                    {project.users && project.users.map(user =>
                        user.userXprojects.endDate === null ?
                            <div key={user.id} style={{ background: user.color, color: user.brightness === 'bright' ? '#fff' : '#000' }} id={style.userDiv}>
                                <img alt="Profile" src={user.profilePic} id={style.profilePic} />
                                <div className='displayFlexColumn' id='alignItemsCenter'>
                                    <h5 className='font800'>@ {user.username}</h5>
                                    <span id={style.lowEnphasis}>{user.userXprojects.role}</span>
                                </div>
                                <Link to={`/user/${user.username}`}>
                                    <button style={{ color: user.brightness === 'bright' ? '#fff' : '#000', border: user.brightness === 'bright' ? '2px solid #fff' : '2px solid #000' }} id={style.contactBtn}>Contact</button>
                                </Link>
                            </div> :
                            null
                    )}
                </div>
            </div>
            {project.jobOpportunities && project.jobOpportunities.length > 0 &&
                <div id={style.mainJobDiv}>
                    <h2 className='font800'>Join {project.name}</h2>
                    {project.jobOpportunities.map(job => <JobCard key={job.id} project={project} job={job} />)}
                </div>}
        </div>
    )
}

function mapStateToProps(state) {
    return {
        user: state.userInfo
    }
}

export default connect(mapStateToProps, null)(ProjectProfile);