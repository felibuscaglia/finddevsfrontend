import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import style from './GoPremium.module.css';
import Verified from '../../Media/Verification.png';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import { connect } from 'react-redux';
const { REACT_APP_PAYPAL_CLIENTID } = process.env;

function GoPremium({ isAdminPanel, isHomepage, userInfo }) {

    const [checkout, setCheckout] = useState(false);
    const [loading, setLoading] = useState(false);

    const paymentHandler = (details, data) => {
        setLoading(true);
        var infoToUpdate = {
            isPremium: true,
            orderID: data.orderID,
            payerID: data.payerID
        }
        axios.post(`/users/${userInfo.id}/premium`, infoToUpdate)
            .then(res => window.location.replace('/success'))
            .catch(err => console.log(err))
    }

    function closePopUp(close) {
        setCheckout(false);
        close();
    }

    return (
        <Popup trigger={isAdminPanel ?
            <span id={style.postBtn}>Post a project</span> :
            isHomepage ?
                <button className={style.smallBtn}>Join the community.</button> :
                <button id={style.goPremiumBtn}>Go premium</button>} modal>
            {close => (
                <div id={style.mainDiv}>
                    <div id={style.form}>
                        {loading ?
                            <img alt="Loading GIF" src='https://flevix.com/wp-content/uploads/2019/07/Bar-Preloader-1.gif' /> :
                            checkout ?
                                <div id={style.payPalDiv}>
                                    <button id={style.paypal} onClick={() => closePopUp(close)}><i class="fas fa-times"></i></button>
                                    <PayPalButton
                                        amount={11.99}
                                        currency={'USD'}
                                        onSuccess={paymentHandler}
                                        shippingPreference={"NO_SHIPPING"}
                                        options={{
                                            clientId: REACT_APP_PAYPAL_CLIENTID
                                        }}
                                    />
                                </div> :
                                <div id={style.infoDiv}>
                                    <button id={style.closeBtn} onClick={() => closePopUp(close)}><i class="fas fa-times"></i></button>
                                    <div className='displayFlex' id='alignItemsCenter'>
                                        <h1 id={style.titleGP}>Get verified and become a premium member!</h1>
                                    </div>
                                    <div id={style.pros}>
                                        <div id={style.firstDiv}>
                                            <span className={style.pro}>🧑‍💻 Join the community and<span className='font800'> get the boost your career as a developer or your startup needs.</span></span>
                                            <div className={style.pro}>
                                                <img alt="Verification badge" src={Verified} id={style.icon} />
                                                <span>Verify yourself and be the first person project founders see when they are looking for developers, by <span className='font800'>appearing on the frontpage of the workers directory.</span></span>
                                            </div>
                                            <span className={style.pro}>🚀 <span className='font800'>Eliminate the limit of projects that you can publish</span>, so you will have the opportunity to promote any idea you have.</span>
                                            <span className={style.pro}>🔥 Any work you post will have the FindDevs check mark <span className='font800'>(4x more visits and applicants) and will appear on the top of the published work directory</span>.</span>
                                        </div>
                                        <div>
                                            <div id={style.price}>
                                                <span className='font800'>$11.99</span>
                                                <span className={style.advert}>One time payment.</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div id={style.paymentDiv}>
                                        {isHomepage && !userInfo.username ? null : userInfo.isPremium ? <span id={style.alreadyMember}><i class="fas fa-check-circle"></i> You are already a premium member of FindDevs!</span> : <button onClick={() => setCheckout(true)} id={style.btn}>Go premium</button>}
                                    </div>
                                </div>}
                    </div>
                </div>
            )}
        </Popup>
    )
}

function mapStateToProps(state) {
    return {
        userInfo: state.userInfo
    }
}

export default connect(mapStateToProps, null)(GoPremium);