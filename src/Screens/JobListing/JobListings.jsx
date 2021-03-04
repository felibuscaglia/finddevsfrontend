import React, { useState } from 'react';
import { connect } from 'react-redux';
import style from './JobListings.module.css';
import { filterJob, removeJobFilter } from '../../Actions/index';
import { Hint } from 'react-autocomplete-hint';
import JobCard from './JobCard';
import Loading from '../../Media/Loading.gif';
import wavyImage from '../../Media/wavyBorder1.jpg';

function JobListings({ jobs, skills, skillSelection, filteredJobs, filterJob, removeJobFilter }) {

    const [loading, setLoading] = useState(false);

    function addSkill(e) {
        if (e.keyCode === 13) {
            const dontRepeat = skillSelection.find (skill => skill.label.toLowerCase() === e.target.value.toLowerCase());
            const found = skills.find(skill => skill.label.toLowerCase() === e.target.value.toLowerCase());
            if (found && !dontRepeat) {
                setLoading(true);
                filterJob(found);
                e.target.value = '';
                setLoading(false);
            }
        }
    }

    return (
        <div className='displayFlexColumn' id='alignItemsCenter'>
            <div style={{ backgroundImage: `url(${wavyImage})`}} id={style.mainImage}>
                <div id={style.searchDiv}>
                    <i class="fas fa-search"></i>
                    <Hint options={skills}>
                        <input onKeyDown={(e) => addSkill(e)} type='text' placeholder='Search for job skills' id={style.searchInput} />
                    </Hint>
                </div>
            </div>
            <div style={{ display: skillSelection.length > 0 ? 'block' : 'none' }} id={style.filteredDiv}>
                {skillSelection.map(filtered =>
                    <span key={filtered.id} onClick={() => removeJobFilter(filtered)} style={{ background: filtered.strongColor, color: filtered.softColor }} id={style.skillSpan}>{filtered.label} <i class="fas fa-times-circle"></i></span>
                )}
            </div>
            {loading ?
                <img alt="Loading GIF" id={style.loading} src={Loading} /> :
                skillSelection.length === 0 ?
                    jobs.map(job => <JobCard key={job.id} setLoading={setLoading} job={job} />)
                    :
                    filteredJobs.map(job => <JobCard key={job.id} setLoading={setLoading} job={job} />)
            }
            {!loading && <div className={style.endDiv} id='giveMargin'>🧑‍💻 <span id={style.end}>There are no more job opportunities. Please come back later!</span></div>}
        </div>
    )
}

function mapStateToProps(state) {
    return {
        jobs: state.jobs,
        skills: state.allSkills,
        skillSelection: state.jobSkillSelection,
        filteredJobs: state.filteredJobs
    }
}

function mapDispatchToProps(dispatch) {
    return {
        filterJob: skill => dispatch(filterJob(skill)),
        removeJobFilter: skill => dispatch(removeJobFilter(skill))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobListings);