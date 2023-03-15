import { useEffect, useState } from 'react';
import axios from 'axios';

import MyRecipes from '../../components/MyRecipes/MyRecipes';
import MySavedRecipes from '../../components/MySavedRecipes/MySavedRecipes';
import MyFriends from '../../components/ViewMyFriends/MyFriends';
import LoginButton from '../../components/LoginButton/LoginButton';

import './GuestProfile.scss'

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const GuestProfile = () => {
    

  const [profileData, setProfileData] = useState(null);
  const [viewMyRecipe, setViewMyRecipe] = useState(true);
  const [viewMySavedRecipe, setViewMySavedRecipe] = useState(false);
  const [viewMyFriends, setViewMyFriends] = useState(false);
  // state to set user's recipes
  const [recipes, setRecipes] = useState([])
  const [savedRecipes, setSavedRecipes] = useState([])
  // state to show user's followers
  const [friends, setFriends] = useState([])


  useEffect(() => {
    // Send a GET request for profile information
    // If user is currently logged in, we will get profile data, if they are not logged in, we will get 401 (Unauthorized) that we can handle in `.catch`
    // Note that we need to use `withCredentials` in order to pass the cookie to a server
    axios
      .get(`${SERVER_URL}/user/8`)
      .then((res) => {
        setProfileData(res.data[0]);
        
        axios.get(`${SERVER_URL}/recipe/${res.data[0].id}`)
        .then((res) => setRecipes(res.data))
        .catch((err) => console.log(err))
        
        axios.get(`${SERVER_URL}/recipe/saved/${res.data[0].id}`)
        .then((res) => setSavedRecipes(res.data))
        .catch((err) => console.log(err))
        
        axios.get(`${SERVER_URL}/user/friend/${res.data[0].id}`)
        .then((res) => setFriends(res.data))
        .catch((err) => console.log(err))
      })
      .catch((err) => {
          console.log('Error authenticating', err);
      });
  }, []);

  const recipeClickHandler = ()=>{
    setViewMyRecipe(true)
    setViewMyFriends(false)
    setViewMySavedRecipe(false)
  }

  const savedRecipeClickHandler = ()=>{
    setViewMyRecipe(false)
    setViewMyFriends(false)
    setViewMySavedRecipe(true)
  }

  const myFriendsClickHandler = ()=>{
    setViewMyRecipe(false)
    setViewMyFriends(true)
    setViewMySavedRecipe(false)
  }


  return (
    <>
      {
        profileData && (
          <section className='profile'>
            <div className='profile__header'>
              <div
                className="profile__avatar"
                style={{backgroundImage: `url(${profileData.avatar_url})`}}
                alt={`${profileData.username} avatar`}
              ></div>
              <h2 className='profile__username'>{profileData.username}</h2>
            </div>
            {/* profile navigation */}
            <div className="profile__wrapper">
              <nav>
                <ul className='profile__stats'>
                  <li className="profile__stats-item profile__stats-item--first">
                    <div className='profile__stats-num'>{recipes.length}</div>
                    <div onClick={()=>recipeClickHandler()} className={!viewMyRecipe ? "profile__nav-link" :"profile__nav-link profile__nav-link--active"}>My Recipes</div>
                  </li>
                  <li className="profile__stats-item">
                    <div className='profile__stats-num'>{savedRecipes.length}</div>
                    <div onClick={()=>savedRecipeClickHandler()} className={!viewMySavedRecipe ? "profile__nav-link" :"profile__nav-link profile__nav-link--active"}>Saved Recipes</div>
                  </li>
                  <li className="profile__stats-item">
                    <div className='profile__stats-num'>{friends.length}</div>
                    <div onClick={()=>myFriendsClickHandler()} className={!viewMyFriends ? "profile__nav-link" :"profile__nav-link profile__nav-link--active"}>Following</div>
                  </li>
                </ul>
              </nav>
              {viewMyRecipe?(
                  <MyRecipes userId={profileData.id} recipes={recipes}/>
                  ):(
                  viewMySavedRecipe?(
                    <MySavedRecipes userId={profileData.id} savedRecipes={savedRecipes} />
                    ):(
                    <MyFriends userId={profileData.id} friends={friends}/>)
              )}
            </div>
          </section>
        )
    }
    </>
  )
}

export default GuestProfile