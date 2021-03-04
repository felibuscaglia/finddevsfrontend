import React from 'react';
import style from './NotFound.module.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

function NotFound({ user }) {
    return (
        <div id={style.notFound}>
            <h1 id={style.text} className='font800'>Oops... nothing was found. <Link to={user.username ? `/user/${user.username}` : '/' } id={style.link}>Go back.</Link></h1>
        </div>
    )
}

function mapStateToProps (state) {
    return {
        user: state.userInfo
    }
}

export default connect (mapStateToProps, null) (NotFound);