import React from 'react';
import style from './ApplicantsPopUp.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

function Accepted({ decided, projectName, type }) {
    return (
        <div id={style.form2}>
            {type === 'Invitation' ?
                <div className={style.acceptedDiv}>
                    <FontAwesomeIcon icon={faCheckCircle} id={style.accepted} />
                    <h1>{decided} was invited to {projectName}!</h1>
                </div> :
                <div className={style.acceptedDiv}>
                    <FontAwesomeIcon id={style.accepted} icon={faCheckCircle} />
                    <h1>{decided} is now part of {projectName}!</h1>
                </div>
            }
        </div>
    )
}

export default Accepted;