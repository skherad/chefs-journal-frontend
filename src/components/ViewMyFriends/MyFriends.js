import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import uniqid from 'uniqid';
import axios from 'axios';

import './MyFriends.scss'

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const MyFriends = ({userId, friends}) => {


  return (
    <section className='friends'>
      <ul className="explore__user-container">
        {friends.map((e) => {
          return(
          <Link to={`/userProfile/${userId}/${e.id}`}  key={uniqid()}  className="explore__user links">
              <li  className='explore__user-item' style={{backgroundImage: `url(${e.avatar_url})`}}>
                <div  className='explore__user-title-container'>
                  <p className='explore__user-title'>{e.name}</p>
                </div>
              </li>
          </Link>
          )
        })}
      </ul>
    </section>
  )
}

export default MyFriends