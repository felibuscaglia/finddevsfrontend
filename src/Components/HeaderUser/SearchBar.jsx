import React from 'react';
import style from './HeaderUser.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function SearchBar () {
    function redirect (e) {
        if (e.keyCode === 13 && e.target.value !== '') {
            window.location.replace (`/suggestions?${e.target.value}`)
        }
    }

    return (
        <div id={style.inputDiv}>
            <FontAwesomeIcon icon={faSearch} />
            <input onKeyDown={(e) => redirect (e)} id={style.input} placeholder="Search for startups and users" />
        </div>
    )
}

export default SearchBar;