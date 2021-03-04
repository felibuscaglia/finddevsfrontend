import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from './Components/Header/Header';
import Homepage from './Screens/Homepage/Homepage';
import UserProfile from './Screens/UserProfile/UserProfile';
import Footer from './Components/Footer/Footer';
import HeaderUser from './Components/HeaderUser/HeaderUser';
import PostStartup from './Screens/PostStartup/PostStartup';
import ProjectProfile from './Screens/ProjectProfile/ProjectProfile';
import StartupAdminPanel from './Screens/StartupAdminPanel/StartupAdminPanel';
import JobPanel from './Screens/StartupAdminPanel/JobPanel/JobPanel';
import AddJob from './Screens/AddJob/AddJob';
import { connect } from 'react-redux';
import { setSkills, setUserInfo, setProjects, getUsers, getNotifications, getJobs } from './Actions/index';
import jwt from 'jsonwebtoken';
import JobListings from './Screens/JobListing/JobListings';
import SettingsPanel from './Screens/PostStartup/ProjectSettings';
import WorkersList from './Screens/WorkersList/WorkersList';
import JobInfo from './Screens/JobInfo/JobInfo';
import EditUser from './Screens/EditUser/EditUser';
import Suggestions from './Screens/Suggestions/Suggestions';
import NotFound from './Screens/NotFound/NotFound';
import SuccessPage from './Screens/SuccessPage/SuccessPage';

function App({ setGlobalSkills, setUserInfo, setProjects, getUsers, getNotifications, getJobs }) {

    useEffect(() => {
        const user = jwt.decode(JSON.parse(localStorage.getItem('user')));
        if (user) {
            setUserInfo(user.username);
            getNotifications(user.username);
        }
        setGlobalSkills();
        setProjects();
        getUsers();
        getJobs();
    }, [])

    return (
        <div>
            <Route exact path='/' component={Header} />
            <Route path='/' render={({ location }) => < HeaderUser pathname={location} />} />
            <Switch>
                <Route exact path='/' component={Homepage} />
                <Route exact path='/jobs' component={JobListings} />
                <Route exact path='/user/:username' render={({ match, location }) => < UserProfile pathname={location} username={match.params.username} />} />
                <Route exact path='/project/post' component={PostStartup} />
                <Route exact path='/project/profile/:projectId' render={({ match }) => < ProjectProfile projectID={match.params.projectId} />} />
                <Route exact path='/admin/panel' component={StartupAdminPanel} />
                <Route exact path='/project/jobPanel/:projectId' render={({ match }) => < JobPanel projectID={match.params.projectId} />} />
                <Route exact path='/project/addJob/:projectId' render={({ match }) => < AddJob projectID={match.params.projectId} />} />
                <Route exact path='/project/settings/:projectId' render={({ match }) => <SettingsPanel projectID={match.params.projectId} />} />
                <Route exact path='/job/info/:jobId' render={({ match }) => < JobInfo jobID={match.params.jobId} />} />
                <Route exact path='/edit/user/me' component={EditUser} />
                <Route exact path='/workers' component={WorkersList} />
                <Route exact path='/suggestions' render={({ location }) => <Suggestions pathname={location} />} />
                <Route exact path='/success' component={SuccessPage} />
                <NotFound />
            </Switch>
            <Route exact path='/' component={Footer} />
        </div>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        setGlobalSkills: nothing => dispatch(setSkills()),
        setUserInfo: username => dispatch(setUserInfo(username)),
        setProjects: nothing => dispatch(setProjects()),
        getUsers: nothing => dispatch(getUsers()),
        getNotifications: username => dispatch(getNotifications(username)),
        getJobs: nothing => dispatch(getJobs())
    };
}

export default connect(null, mapDispatchToProps)(App);