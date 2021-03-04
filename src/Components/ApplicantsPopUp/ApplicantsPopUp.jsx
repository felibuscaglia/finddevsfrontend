import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import style from './ApplicantsPopUp.module.css';
import axios from 'axios';
import ApplicantsList from './ApplicantsList';
import Accepted from './Accepted';

function ApplicantsPopUp({ job, projectName, brightness, projectLogo }) {

    const [applicants, setApplicants] = useState([]);
    const [decided, setDecided] = useState(null);

    useEffect(() => {
        axios.get(`/jobs/${job.id}/applicants`)
            .then(applicantes => setApplicants(applicantes.data))
            .catch(err => console.log(err))
    }, [])

    return (
        <Popup trigger={<span style={{ color: brightness === 'bright' ? '#000' : '#fff', background: brightness === 'bright' ? '#fff' : '#000' }} id={style.editBtn}>Applicants</span>} modal>
            {close => (
                <div id={style.mainDiv}>
                    {decided ? <Accepted decided={decided} projectName={projectName} /> : <ApplicantsList projectLogo={projectLogo} job={job} projectName={projectName} applicants={applicants} close={close} setApplicants={setApplicants} setDecided={setDecided} />}
                </div>
            )}
        </Popup>
    )
}

export default ApplicantsPopUp