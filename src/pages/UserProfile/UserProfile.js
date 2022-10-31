import { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import uniqid from 'uniqid';
import axios from 'axios';

import LoginButton from '../../components/LoginButton/LoginButton';

import './UserProfile.scss'

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const UserProfile = () => {

  let {profileId, userId} = useParams();

  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedUserRecipes, setSelectedUserRecipes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Check if user is currently logged in, so we can display a form or login button conditionally
    axios
      .get(`${SERVER_URL}/auth/profile`, { withCredentials: true })
      .then((res) => {
        if (res.data) {
          setIsLoggedIn(true);
        }
      });
  }, []);

  // get selected user recipes
  useEffect(()=>{
    axios.get(`${SERVER_URL}/recipe/${profileId}`)
    .then((res) => setSelectedUserRecipes(res.data))
    .catch((err) => <div>nothing found</div>)
  },[])

  // get selected user info
  useEffect(()=>{
    axios.get(`${SERVER_URL}/user/${profileId}`)
    .then((res) => setSelectedUser(res.data))
    .catch((err) => <div>nothing found</div>)
  },[])

  // handle follow button, post to server new save
  const connectHandler = (e) => {
    e.preventDefault();
    let newFriend = {
      user_id: userId,
      friend_id: profileId
    }
    axios.post(`${SERVER_URL}/user/friend/${profileId}`, newFriend,  { withCredentials: true })
    .then(res => setConnected(true))
    .catch(err => console.log(err))
  }

  return (
    <>
      {isLoggedIn?(
      <section className='user'>
        <div className='profile__header'>
          <div  className='profile__avatar' style={{backgroundImage: `url(${selectedUser[0]?.avatar_url})`}}></div>
          <div className="user__header">{selectedUser[0]?.name}</div>
        </div>
        <div>
          <button onClick={connectHandler}  className={!connected ? 'user__connect' :"single-recipe__save-button--disabled"}>Follow</button>
          {connected&&<button className="user__connect user__connect--done">Followed✔️</button>}
          <button className='user__msg' disabled>Message</button>
        </div>
        
        {/* render selected user's recipes */}
        <ul className="recipe__list">
          {selectedUserRecipes?.map(e =>
              <Link to={`/singleRecipe/${userId}/${e.id}`}  key={uniqid()} className=" recipe__card links">
                <li  className='recipe__item' style={{backgroundImage: `url(${e.photo})`}}>
                  <div  className='recipe__title-container'>
                    <p className='recipe__title'>{e.title}</p>
                  </div>
                </li>
              </Link>
          )}
        </ul>
      </section>
    ):(
      // If user is not logged in, render login button
      <>
        <p>
          <strong>Please login.</strong>
        </p>
        <LoginButton />
      </>
    )}
    </>
    
  )
}

export default UserProfile