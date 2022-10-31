import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';

import ProfileIcon from '../../assets/images/profile1.svg';
import SearchIcon from '../../assets/images/search.svg';
import LogOutIcon from '../../assets/images/logout.svg';
import logo from '../../assets/images/chefs-journal.png';

import './Header.scss';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Header = () => {

  // states to set login status and set user id to be passed down to components
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null)

  // Check if user is currently logged in, so we can display a form or login button conditionally
  useEffect(() => {
    axios
      .get(`${SERVER_URL}/auth/profile`, { withCredentials: true })
      .then((res) => {
        if (res.data) {
          setIsLoggedIn(true);
          setUserId(res.data.id)
        }
      });
  }, []);

  return (
    <header className="header">
      <Link to="/profile" className="header__link-logo"><img src={logo} className="header__logo"></img></Link>
      {/* show nav buttons if user is logged in */}
      {isLoggedIn &&
        <nav className="header__nav">
          <Link to="/profile" className="header__link"><img src={ProfileIcon} className="icon" alt="profile"></img></Link>
          <Link to={`/explore/${userId}`} className="header__link"><img src={SearchIcon} className="icon" alt="search"></img></Link>
          <a className="header__link" href={`${SERVER_URL}/auth/logout`}>
            <img src={LogOutIcon} className="icon"/>
          </a>
        </nav>
      }
    </header>
  )
}

export default Header