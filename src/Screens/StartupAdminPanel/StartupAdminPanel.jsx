import React, { useState, useLayoutEffect } from 'react';
import Logo from '../../Media/invertedlogo.png';
import style from './StartupAdminPanel.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import ProjectCard from '../../Components/ProjectCard/ProjectCard';
import Empty from '../../Media/emptyJob.svg';
import jwt from 'jsonwebtoken';
import { setUserInfo } from '../../Actions/index';
import Loading from '../../Media/Loading.gif';
import GoPremium from '../../Components/GoPremiumPopUp/GoPremium';
import { Alert } from 'reactstrap';

function StartupAdminPanel({ user, limitOfPosts, setUserInfo }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(false);

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
        axios.get(`/users/${user.username}/projects`)
            .then(projectsData => {
                projectsData.data = projectsData.data.sort((a, b) => {
                    return b.userXprojects.isFounder - a.userXprojects.isFounder
                })
                setProjects(projectsData.data)
                setLoading(false);
            })
            .catch(err => console.log(err))
    }, [user])

    function leaveProject () {
        setLoading (true);
        axios.delete (`/users/${user.id}/${alert.id}`)
            .then (res => window.location.reload ())
            .catch (err => console.log (err))
    }

    if (loading) {
        return <img alt="Loading GIF" src={Loading} id={style.loading} />
    }

    return (
        <div className='displayFlex'>
            <div id={style.fixedDiv} >
                <div id={style.logoDiv}>
                    <img alt="Inverted FindDevs logo" src={Logo} id={style.invertedLogo} />
                </div>
                <Link id={style.link} to={`/user/${user.username}`}><span className='font200'><i class="fas fa-door-open"></i> Go back</span></Link>
            </div>
            <div id={style.secondDiv}>
                <div id={style.projectDiv}>
                    {projects.length > 0 && <h1 className='font800'>Your projects</h1>}
                    {projects.length > 0 ? projects.map(project => project.userXprojects.endDate !== null ? null : project.userXprojects.isFounder ? <ProjectCard key={project.id} project={project} isFounder={true} /> : <ProjectCard setAlert={setAlert} key={project.id} project={project} isFounder={false} />) :
                        <div id={style.emptyDiv}>
                            <img alt="No jobs posted" src={Empty} id={style.empty} />
                            <div>
                                <h1 id={style.emptyTitle}>Start gathering the team.</h1>
                                <Link className='links' to='/project/post'><div id={style.addBtn2}>Post a project</div></Link>
                            </div>
                        </div>}
                </div>
                {projects.length > 0 && !limitOfPosts ? <Link to='/project/post'><span id={style.postBtn}>Post a project</span></Link> : <GoPremium isAdminPanel={true} />}
                {alert && <Alert id={style.alert} color="danger">Are you sure you want to leave {alert.name}? <div className='displayFlex' id='alignItemsCenter' onClick={() => setAlert (false)} ><i id={style.pick} class="fas fa-times-circle"></i></div> <div onClick={ leaveProject } className='displayFlex' id='alignItemsCenter'><i id={style.pick} class="fas fa-check-circle"></i></div></Alert>}
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        user: state.userInfo,
        limitOfPosts: state.limitOfPosts
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setUserInfo: username => dispatch(setUserInfo(username))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StartupAdminPanel);