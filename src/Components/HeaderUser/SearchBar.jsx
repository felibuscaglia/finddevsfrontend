import React from 'react';
import style from './HeaderUser.module.css';

function SearchBar () {
    function redirect (e) {
        if (e.keyCode === 13 && e.target.value !== '') {
            window.location.replace (`/suggestions?${e.target.value}`)
        }
    }

    return (
        <div id={style.inputDiv}>
            <i class="fas fa-search"></i>
            <input onKeyDown={(e) => redirect (e)} id={style.input} />
        </div>
    )
}

export default SearchBar;