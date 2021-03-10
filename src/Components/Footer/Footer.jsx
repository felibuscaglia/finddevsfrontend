import React from 'react';
import style from './Footer.module.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopCode, faUsers } from '@fortawesome/free-solid-svg-icons';

function Footer() {
    return (
        <div id={style.footer}>
            <div className='displayFlexColumn'>
                <h1 className='font800'>FindDevs</h1>
                <span className='font200'>© 2021 All rights reserved.</span>
                <span style={{ marginTop: "10px" }} className='font600'>contact@finddevs.io</span>
            </div>
            <div className='displayFlex' id={style.lastDiv}>
                <Link className={style.links} to='/jobs'>
                    <div className={style.footerDiv}>
                        <span><FontAwesomeIcon icon={faUsers} /> Startups jobs</span>
                    </div>
                </Link>
                <Link className={style.links} to='/workers'>
                    <div className={style.footerDiv}>
                        <span><FontAwesomeIcon icon={faLaptopCode} /> Developers</span>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Footer;