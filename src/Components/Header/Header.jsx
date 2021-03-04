import React from 'react';
import style from './Header.module.css';
import Logo from '../../Media/logo.png';
import RegisterPopUp from '../PopUps/RegisterPopUp';
import { Link } from 'react-router-dom';
import LoginPopUp from '../PopUps/LoginPopUp';

function Header() {
    return (
        <div id={style.header}>
            <div className='displayFlex' id='alignItemsCenter'>
                <Link to='/' className='links'><img alt="Logo" src={Logo} id='icon' /></Link>
                <Link to='/jobs' className='links'><span id={style.headerIcon}>be part of a startup</span></Link>
                <Link to='/workers' className='links'><span id={style.headerIcon}>find collaborators</span></Link>
            </div>
            <div className='displayFlex' id='alignItemsCenter'>
                <LoginPopUp />
                <RegisterPopUp isHomepage={true} />
            </div>
        </div>
    )
}

export default Header;
