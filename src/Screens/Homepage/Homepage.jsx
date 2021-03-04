import React from 'react';
import style from './Homepage.module.css';
import mainSVG from '../../Media/FirstSVG.svg';
import { Link } from 'react-router-dom';
import FindCandidates from '../../Media/findCandidates.svg';
import PairProgramming from '../../Media/PairProgramming.svg';
import Verification from '../../Media/Verification.png';
import Launching from '../../Media/Launching.svg';
import RegisterPopUp from '../../Components/PopUps/RegisterPopUp';
import GoPremium from '../../Components/GoPremiumPopUp/GoPremium';

function Homepage() {

    return (
        <div>
            <div className='displayFlexColumn' id='alignItemsCenter'>
                <h1 id={style.mainTitle}>Get the boost your startup needs.</h1>
                <RegisterPopUp isMainHomepage={true} />
                <img alt="Startup SVG" src={mainSVG} id={style.mainSVG} />
            </div>
            <div id={style.secondDiv}>
                <div id={style.firstHalf}>
                    <div className='displayFlexColumn' id='alignItemsFS'>
                        <img alt="Decoration" src='https://pics.freeicons.io/uploads/icons/png/1643084561599979347-512.png' id={style.icon} />
                        <h1 id={style.create}>Create the next big thing.</h1>
                    </div>
                    <p className={style.txt}>
                        Publish your startup idea and bring together the team of developers you need to transform it into a reality. Start working with people who want your project to be a total success.
                    </p>
                    <p className={style.txt}>
                        Post jobs, find the candidate that best suits your needs and start working. Also, you can always tempt those developers that you consider a perfect fit for your project.
                    </p>
                    <Link to='/workers'><button className={style.smallBtn}>Search for developers.</button></Link>
                </div>
                <div>
                    <img alt="Startup SVG" id={style.secondSVG} src={FindCandidates} />
                </div>
            </div>
            <div id={style.thirdDiv}>
                <img alt="Startup SVG" id={style.thirdSVG} src={PairProgramming} />
                <div id={style.firstHalf}>
                    <div className='displayFlexColumn' id='alignItemsFS'>
                        <img alt="Decoration icon" src='https://pics.freeicons.io/uploads/icons/png/11068572181595341011-512.png' id={style.icon} />
                        <h1 id={style.create}>Be part of the future.</h1>
                    </div>
                    <p className={style.txt}>
                        People with revolutionary ideas need you and your tech skills to transform them into a reality. Find the project and work group that is most aligned with your needs and preferences and start working.
                    </p>
                    <p className={style.txt}>
                        Improve your portfolio by participating in real work groups and gaining experience with projects.
                    </p>
                    <Link to='/jobs'><button className={style.smallBtn}>Find startup jobs.</button></Link>
                </div>
            </div>
            <div id={style.lastDiv}>
                <img alt="Verification badge" src={Verification} id={style.icon} />
                <h1 id={style.create}>Become a premium member.</h1>
                <p style={{ width: '60%' }} className={style.lastTxt}>
                    Say goodbye to the limit of projects you can post, appear on the frontpage of the workers directory. Plus, all the jobs you post will have the verification mark (4x more visits and applicants) and will appear first in the searches.
                </p>
                <GoPremium isHomepage={true} />
                <img alt="Startup SVG" src={Launching} id={style.lastSVG} />
            </div>
        </div>
    )
}

export default Homepage;