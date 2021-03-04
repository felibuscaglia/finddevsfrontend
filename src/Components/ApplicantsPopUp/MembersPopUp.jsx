import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import style from './ApplicantsPopUp.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ChangeRole from './ChangeRole';
import { CopyToClipboard } from 'react-copy-to-clipboard';

function MembersPopUp({ projectID, userInfo, brightness, isFounder }) {

    const [project, setProject] = useState({});
    const [changeRole, setChangeRole] = useState(false);
    const [copied, setCopied] = useState(false);
    const [fire, setFire] = useState(false);

    useEffect(() => {
        axios.get(`/projects/${projectID}`)
            .then(projectData => setProject(projectData.data))
            .catch(err => console.log(err))
    }, [])

    function copiedFunction() {
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 3000)
    }

    function fireUser(userID) {
        axios.delete(`/projects/${projectID}/${userID}/fire`)
            .then(res => window.location.reload ())
            .catch(err => console.log(err))
    }

    return (
        <Popup trigger={
            <div style={{ color: brightness === 'bright' ? '#fff' : '#000', border: brightness === 'bright' ? '2px solid #fff' : '2px solid #000' }} className={style.redirectDiv}>
                <span><i class="fas fa-users"></i> Members</span>
            </div>}
            modal>
            {close => (
                <div id={style.mainDiv}>
                    {!changeRole ?
                        <div id={style.memberForm}>
                            <button id={style.closeBtn} onClick={close}><i class="fas fa-times"></i></button>
                            <h1 className='font200'><span className='font800'>{project.name}</span> members</h1>
                            <div id={style.topApplicantDiv}>
                                {project.users && project.users.map(user =>
                                    user.userXprojects.endDate === null && 
                                    <div key={user.id} id={style.applicantDiv}>
                                        <div className='displayFlex' id='alignItemsCenter'>
                                            <div id={style.profilePic}></div>
                                            <div id={style.memberInfo}>
                                                <span className='font800'>{`@ ${user.username}`}</span>
                                                <span className='font200'>{user.userXprojects.role}</span>
                                            </div>
                                        </div>
                                        {user.username !== userInfo.username &&
                                            <div id={style.socialMediaDiv2}>
                                                {isFounder && <button onClick={() => setChangeRole(user)} id={style.btn}>CHANGE ROLE</button>}
                                                <Link to={`/user/${user.username}?verify`}><button id={style.btn}>VALIDATE</button></Link>
                                                <CopyToClipboard text={user.email}><button id={style.btn} onClick={copiedFunction} >CONTACT</button></CopyToClipboard>
                                                {isFounder && <button onClick={() => setFire(user)} id={style.btn}>FIRE</button>}
                                            </div>}
                                    </div>
                                )}
                            </div>
                        </div> :
                        <ChangeRole userData={changeRole} setChangeRole={setChangeRole} projectName={project.name} />}
                    {copied && <div id={style.copiedAlert} class="alert alert-success" role="alert">Copied user's contact email to clipboard!</div>}
                    {fire && <div id={style.copiedAlert} class="alert alert-danger" role="alert">
                        Are you sure you want to fire {fire.username}?
                        <button className={style.actionBtn} onClick={() => fireUser(fire.id)}><i class="far fa-check-circle"></i></button>
                        <button onClick={() => setFire(false)} className={style.actionBtn}><i class="far fa-times-circle"></i></button>
                    </div>}
                </div>
            )}
        </Popup>
    )
}

function mapDispatchToProps(state) {
    return {
        userInfo: state.userInfo
    }
}

export default connect(mapDispatchToProps, null)(MembersPopUp);