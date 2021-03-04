import React, { useEffect, useState } from 'react';
import style from './UserCard.module.css';
import Verification from '../../Media/Verification.png';
import { Link } from 'react-router-dom';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
    arrow: { color: "#181a19" }
}));

function UserCardSearch({ user }) {
    const [extraSkills, setExtraSkills] = useState(null);
    const [ESL, setESL] = useState(0);

    useEffect(() => {
        if (user.skills) {
            const reduced = user.skills.slice(8).reduce((acc, curr, index) => index === user.skills.slice(8).length - 1 ? acc + curr.label : acc + `${curr.label}, `, '');
            setExtraSkills(reduced);
            setESL(user.skills.slice(8).length);
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

    return (
        <div id={style.userCard}>
            <div id='alignItemsCenter' className='displayFlexColumn'>
                <img alt="Profile" id={style.profilePic} src={user.profilePic} />
                <div className='displayFlex' id='alignItemsCenter'>
                    <span className='font800'><span style={{ color: user.color }}>@ </span>{user.username}</span>
                    {user.isPremium && <img alt="Verification badge" id={style.verification} src={Verification} />}
                </div>
            </div>
            <p id={style.bio}>{user.description}</p>
            <div className='justifyCenter' style={{ flexWrap: 'wrap' }}>
                {user.skills && user.skills.slice(0, 8).map(skill =>
                    <div key={skill.id} id={style.skillDiv}>
                        <span
                            style={{ background: `${skill.strongColor}`, color: skill.softColor }}
                            id={style.skillSpan}>
                            {skill.user_skills.isValidated && <i style={{ marginRight: '5px' }} class="fas fa-check-circle"></i>}{skill.label}
                        </span>
                    </div>
                )}
                {extraSkills &&
                    <BlueOnGreenTooltip classes={{ arrow: classes.arrow }} id={style.tooltip} title={extraSkills} arrow>
                        <span id={style.plusSearch}>+{ESL}</span>
                    </BlueOnGreenTooltip>}
            </div>
            <Link style={{ width: '100%' }} to={`/user/${user.username}`}><button id={style.btn} style={{ background: user.color }}>Contact</button></Link>
        </div>
    )
}

export default UserCardSearch;