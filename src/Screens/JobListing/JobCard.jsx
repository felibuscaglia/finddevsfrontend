import React from 'react';
import style from './JobListings.module.css';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { filterJob } from '../../Actions/index';
import moment from 'moment';
import { getDate } from '../../utils';
import Verification from '../../Media/logo.png';
import InvertedVerification from '../../Media/invertedlogo.png';

const useStyles = makeStyles(theme => ({
    arrow: { color: "#181a19" }
}));

function JobCard({ job, filterJobs, setLoading, skillSelection }) {

    const classes = useStyles();

    const BlueOnGreenTooltip = withStyles({
        tooltip: {
            color: "white",
            backgroundColor: "#181a19",
            fontFamily: 'Nunito',
            fontSize: '12px'
        }
    })(Tooltip);

    function addSkill (skill) {
        setLoading (true);
        const dontRepeat = skillSelection.find (filtered => filtered.id === skill.id);
        if (!dontRepeat) filterJobs(skill);
        setLoading (false);
    }

    return (
        <div id={style.mainDiv} style={{ background: job.project.mainColor, color: job.project.brightness === 'bright' ? '#fff' : '#000' }}>
            <div className='displayFlex' id='alignItemsCenter'>
                <div id={style.imgDiv}><img alt="Project logo" src={job.project.logo} id={style.icon} /></div>
                <div id={style.jobInfoDiv}>
                    <div className='displayFlex' id={style.nameAndLogo}>
                        <span id={style.projectName}>{job.project.name}</span>
                        {job.project.isPremium && <BlueOnGreenTooltip classes={{ arrow: classes.arrow }} id={style.tooltip} title='Verified project' arrow>
                            <img alt="FindDevs verification" id={style.verification} src={job.project.brightness === 'bright' ? InvertedVerification : Verification} />
                        </BlueOnGreenTooltip>}
                    </div>
                    <span>{job.title}</span>
                    <div id={style.badgeDiv}>
                        {job.project.upvotes > 50 && <span id={style.badge}><i class="fas fa-thumbs-up"></i> HIGHLY UPVOTED</span>}
                        {job.project.users.length > 5 && <span id={style.badge}><i class="fas fa-chart-line"></i> GROWING FAST</span>}
                        {job.project.users.length >=10 && <span id={style.badge}><i class="fas fa-users"></i> BIG TEAM</span>}
                    </div>
                </div>
            </div>
            <div id={style.skillDiv}>
                {job.skills.map(skill =>
                    <BlueOnGreenTooltip key={skill.id} classes={{ arrow: classes.arrow }} id={style.tooltip} title='Add tag to filters' arrow>
                        <div style={{ border: job.project.brightness === 'bright' ? '2px solid #fff' : '2px solid #000' }} onClick={() => addSkill (skill) } id={style.skillSpan}>{skill.label}</div>
                    </BlueOnGreenTooltip>
                )}
            </div>
            <div id={style.applyAndMoment}>
                <Link to={`/job/info/${job.id}`}><button style={{ color: job.project.brightness === 'bright' ? '#fff' : '#000', border: job.project.brightness === 'bright' ? '4px solid #fff' : '4px solid #000' }} id={style.btn}>Apply</button></Link>
                <span id={style.time}>📌{getDate(moment(job.createdAt).format('MM/DD/YYYY'))}</span>
            </div>
        </div>
    )
}

function mapStateToProps (state) {
    return {
        skillSelection: state.jobSkillSelection
    }
}

function mapDispatchToProps(dispatch) {
    return {
        filterJobs: skill => dispatch(filterJob(skill))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobCard);