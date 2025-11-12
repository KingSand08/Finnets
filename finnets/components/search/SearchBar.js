import React from 'react';
import style from './searchbar.module.css';
import SvgComponent from '../SvgComponent';

const SearchBar = () => {
  return (
    <div>
      <form className={style.search_container}>
        <button>
          <SvgComponent
            src={'/icons/search.svg'}
            color='--foreground'
            size='40px'
          />
        </button>
        <input placeholder='Search for any page on your banking platform.' />
      </form>
    </div>
  );
};

export default SearchBar;
