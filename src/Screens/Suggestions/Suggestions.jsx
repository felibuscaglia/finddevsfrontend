import React, { useState, useLayoutEffect } from 'react';
import style from '../WorkersList/WorkersList.module.css';
import { connect } from 'react-redux';
import Loading from '../../Media/Loading.gif';
import UserCardSearch from '../../Components/UserCard/UserCardSearch';
import ProjectCard from '../../Components/UserCard/ProjectCard';
import { findSuggestions } from '../../utils';
import Empty from '../../Media/NotFoundSearch.svg';
import Cover from '../../Media/searchCover.jpg';

function Suggestions({ pathname, users, projects }) {

    const [loading, setLoading] = useState(true);
    const [suggestions, setSuggestions] = useState({});

    useLayoutEffect(() => {
        const allProjectsAndUsers = projects.concat(users);
        setSuggestions(findSuggestions(allProjectsAndUsers, pathname.search));
        setTimeout(() => {
            setLoading (false);
        }, 2000)
    }, [users])


    function search(e) {
        setLoading(true);
        if (e.keyCode === 13) {
            const allProjectsAndUsers = projects.concat(users);
            setSuggestions(findSuggestions(allProjectsAndUsers, `?${e.target.value}`));
        }
        setLoading(false);
    }

    return (
        <div>
            <div id={style.mainImage} style={{ backgroundImage: `url(${Cover})`}}>
                <div id={style.searchDiv}>
                    <i class="fas fa-search"></i>
                    <input onKeyDown={(e) => search(e)} placeholder='Search for projects or users' id={style.searchInput} />
                </div>
            </div>
            {loading ? <img alt="Loading GIF" id={style.suggestionsLoading} src={Loading} /> :
                <div>
                    {suggestions.projects.length > 0 && <div className='displayFlexColumn' id='alignItemsCenter'>
                        <div className='displayFlex' id='alignItemsCenter'>
                            <h1 className='font800'>Projects ({suggestions.projects.length})</h1>
                        </div>
                        <div id={style.userCards}>
                            {suggestions.projects.map(project => <ProjectCard key={project.id} project={project} />)}
                        </div>
                    </div>}
                    {suggestions.users.length > 0 && <div className='displayFlexColumn' id='alignItemsCenter'>
                        <div className='displayFlex' id='alignItemsCenter'>
                            <h1 className='font800'>Developers ({suggestions.users.length})</h1>
                        </div>
                        <div id={style.userCards}>
                            {suggestions.users.map(user => <UserCardSearch key={user.id} user={user} />)}
                        </div>
                    </div>}
                    {suggestions.projects.length === 0 && suggestions.users.length === 0 &&
                        <div className='justifyCenter' id='alignItemsCenter'>
                            <img alt="No suggestions found" src={Empty} id={style.empty} />
                            <div>
                                <h1 style={{ marginBottom: '25px' }} className='font800'>Oops... nothing was found.</h1>
                            </div>
                        </div>}
                </div>}
        </div>
    )
}

function mapStateToProps(state) {
    return {
        users: state.users,
        projects: state.projects
    }
}

export default connect(mapStateToProps, null)(Suggestions);