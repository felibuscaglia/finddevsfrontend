import React, { useState, useEffect } from 'react';
import style from './UserCard.module.css';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Tooltip from '@material-ui/core/Tooltip';
import Verification from '../../Media/Verification.png';
import { selectWorkers } from '../../Actions/index';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    arrow: { color: "#181a19" }
}));

function UserCard({ user, setLoading, selectWorkers, skillSelection }) {

    const [extraSkills, setExtraSkills] = useState(null);
    const [extraSkillsLength, setExtraLength] = useState(0);

    useEffect(() => {
        if (user.skills) {
            const reduced = user.skills.slice(8).reduce((acc, curr, index) => index === user.skills.slice(8).length - 1 ? acc + curr.label : acc + `${curr.label}, `, '');
            setExtraSkills(reduced);
            setExtraLength(user.skills.slice(8).length);
        }
    }, [])

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
        if (!dontRepeat) selectWorkers(skill);
        setLoading (false);
    }

    return (
        <div id={style.userCard}>
            <div className='displayFlexColumn' id='alignItemsCenter'>
                <img alt="Profile" id={style.profilePic} src={user.profilePic} />
                <div id='alignItemsCenter' className='displayFlex'>
                    <span className='font800' style={{ alignSelf: 'flex-start' }}><span style={{ color: user.color }}>@ </span>{user.username}</span>
                    {user.isPremium && <img alt="Verification badge" id={style.verification} src={Verification} />}
                </div>
                <p id={style.bio}>{user.description}</p>
            </div>
            <div id='alignItemsCenter' className='justifyCenter' style={{ flexWrap: 'wrap' }}>
                {user.skills && user.skills.slice(0, 8).map(skill =>
                    <div key={skill.id} id={style.skillDiv}>
                        <BlueOnGreenTooltip classes={{ arrow: classes.arrow }} id={style.tooltip} title='Add tag to filters' arrow>
                            <span
                                onClick={() => { addSkill (skill) }}
                                style={{ background: `${skill.strongColor}`, color: skill.softColor }}
                                id={style.skillSpan}>
                                {skill.user_skills.isValidated && <i style={{ marginRight: '5px' }} class="fas fa-check-circle"></i>}{skill.label}
                            </span>
                        </BlueOnGreenTooltip>
                    </div>
                )}
                {extraSkills &&
                    <BlueOnGreenTooltip classes={{ arrow: classes.arrow }} id={style.tooltip} title={extraSkills} arrow>
                        <span id={style.plus}>+{extraSkillsLength}</span>
                    </BlueOnGreenTooltip>}
            </div>
            <Link id={style.link} to={`/user/${user.username}`}><button id={style.btn} style={{ background: user.color }}>Contact</button></Link>
        </div>
    )
}

function mapStateToProps (state) {
    return {
        skillSelection: state.skillSelection
    }
}

function mapDispatchToProps(dispatch) {
    return {
        selectWorkers: skill => dispatch(selectWorkers(skill))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserCard);