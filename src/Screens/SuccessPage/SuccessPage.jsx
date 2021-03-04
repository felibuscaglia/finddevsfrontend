import React from 'react';
import style from './SuccessPage.module.css';
import Success from '../../Media/Success.svg';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

function SuccessPage({ userInfo }) {
    return (
        <div>
            <div className='displayFlex' id='alignItemsCenter'>
                <img alt="Successful purchase" id={style.successSVG} src={Success} />
                <div>
                    <h1 className='font800'>Thank you!</h1>
                    <p id={style.thankYou}>
                        You are now a verified FindDevs member, which means you are one step closer to creating the next big thing.
                        Now all that's left is to get to work! The limit now is up to you. Start transforming your ideas into reality.
                    </p>
                    <span className='lowEnphasis'></span>
                    <Link to={`/user/${userInfo.username}`}><button id={style.btn}>Go back to your profile</button></Link>
                </div>
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        userInfo: state.userInfo
    }
}

export default connect(mapStateToProps, null)(SuccessPage);