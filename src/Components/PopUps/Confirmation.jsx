import React, { useState } from 'react';
import style from './PopUpStyle.module.css';
import Popup from 'reactjs-popup';
import axios from 'axios';
import Loading from '../../Media/Loading.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

function Confirmation({ project }) {

    const [loading, setLoading] = useState(false);

    function deleteProject() {
        setLoading (true);
        axios.put(`/projects/${project.id}/delete`, project.users)
            .then (res => window.location.replace ('/admin/panel'))
            .catch(err => setLoading (false))
    }

    return (
        <Popup trigger={<button id={style.delete}>Delete project</button>} modal>
            {close =>
                <div id={style.mainDiv}>
                    <div id={style.warningForm}>
                        {loading ? 
                        <img alt="Loading GIF" src={Loading} /> :
                        <div>
                            <FontAwesomeIcon id={style.warning} icon={faExclamationCircle} />
                            <h2 className='font800'>Are you sure you want to delete {project.name}?</h2>
                            <span id='lowEnphasis'>Keep in mind that this is an irreversible action.</span>
                            <div id={style.btnDiv}>
                                <button onClick={close} id={style.goBack}>No, go back.</button>
                                <button onClick={ deleteProject } id={style.delete}>Yes, i'm sure.</button>
                            </div>
                        </div>}
                    </div>
                </div>
            }
        </Popup>
    )
}

export default Confirmation;