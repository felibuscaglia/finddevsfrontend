import React from 'react';
import style from './ApplicantsPopUp.module.css';

function Accepted({ decided, projectName, type }) {
    return (
        <div id={style.form2}>
            {type === 'Invitation' ?
                <div className={style.acceptedDiv}>
                    <i id={style.accepted} class="fas fa-check-circle"></i>
                    <h1>{decided} was invited to {projectName}!</h1>
                </div> :
                <div className={style.acceptedDiv}>
                    <i id={style.accepted} class="fas fa-check-circle"></i>
                    <h1>{decided} is now part of {projectName}!</h1>
                </div>
            }
        </div>
    )
}

export default Accepted;