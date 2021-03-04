import React, { useState } from 'react';
import { connect } from 'react-redux';
import style from './WorkersList.module.css';
import UserCard from '../../Components/UserCard/UserCard';
import { Hint } from 'react-autocomplete-hint';
import { removeFilters, selectWorkers } from '../../Actions/index';
import GoPremium from '../../Components/GoPremiumPopUp/GoPremium';
import Loading from '../../Media/Loading.gif';
import wavyImage from '../../Media/wavyBorder1.jpg';
import Verification from '../../Media/Verification.png';

function WorkersList({ users, skills, skillSelection, removeFilters, filteredWorkers, selectWorkers, userInfo }) {

    const [loading, setLoading] = useState(false);

    function addSkill(e) {
        if (e.keyCode === 13) {
            const dontRepeat = skillSelection.find (skill => skill.label.toLowerCase() === e.target.value.toLowerCase());
            const found = skills.find(skill => skill.label.toLowerCase() === e.target.value.toLowerCase());
            if (found && !dontRepeat) {
                setLoading(true);
                selectWorkers(found);
                setLoading(false);
                e.target.value = '';
            }
        }
    }

    if (loading) {
        return <img alt="Loading GIF" id={style.loading} src={Loading} />
    }

    return (
        <div className='displayFlexColumn'>
            <div id={style.mainImage} style={{ backgroundImage: `url(${wavyImage})` }}>
                <div id={style.searchDiv}>
                    <i class="fas fa-search"></i>
                    <Hint options={skills}>
                        <input onKeyDown={(e) => addSkill(e)} type='text' placeholder='Search and filter by skill' id={style.searchInput} />
                    </Hint>
                </div>
            </div>
            {!userInfo.isPremium &&
                <div id={style.GPdiv}>
                    <span>Do you want to appear on the frontpage? <span className='font800'>Verify your FindDevs account!</span></span>
                    <GoPremium />
                </div>}
            <div style={{ display: skillSelection.length > 0 ? 'flex' : 'none' }} id={style.filteredDiv}>
                {skillSelection.map(filtered =>
                    <div key={filtered.id} onClick={() => removeFilters(filtered)} style={{ background: filtered.strongColor, color: filtered.softColor }} id={style.skillSpan}>{filtered.label} <i class="fas fa-times-circle"></i></div>
                )}
            </div>
            {skillSelection.length === 0 &&
                <div>
                    <div className='displayFlexColumn' id='alignItemsCenter'>
                        <div className='displayFlex' id='alignItemsCenter'>
                            <img alt="Verification badge" src={Verification} id={style.verification} />
                            <h3 className='font800'>Verified developers</h3>
                        </div>
                        <div id={style.userCards}>
                            {users.map(user => user.isPremium && <UserCard setLoading={setLoading} key={user.id} user={user} />)}
                        </div>
                    </div>
                    <div>
                        {skills.map(skill =>
                            skill.users.length > 0 && skill.users.find(user => user.isPremium === true) ?
                                <div key={skill.id} className='displayFlexColumn' id='alignItemsCenter'>
                                    <div className='displayFlex' id='alignItemsCenter'>
                                        <img alt="Skill logo" src={skill.logo} id={style.verification} />
                                        <h3 className='font800'>{skill.label} developers ({skill.users.length})</h3>
                                    </div>
                                    <div id={style.userCards}>
                                        {skill.users.map(user => user.isPremium && <UserCard setLoading={setLoading} key={user.id} user={user} />)}
                                    </div>
                                </div> : null
                        )}
                    </div>
                </div>
            }
            {skillSelection.length > 0 && filteredWorkers.length !== 0 &&
                <div className='justifyCenter' id='flexWrap'>
                    {filteredWorkers.map(worker => <UserCard setLoading={setLoading} key={worker.id} user={worker} />)}
                </div>
            }
        </div>
    )
}

function mapStateToProps(state) {
    return {
        users: state.users,
        skills: state.allSkills,
        skillSelection: state.skillSelection,
        filteredWorkers: state.filteredWorkers,
        userInfo: state.userInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        removeFilters: skill => dispatch(removeFilters(skill)),
        selectWorkers: skill => dispatch(selectWorkers(skill))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkersList);