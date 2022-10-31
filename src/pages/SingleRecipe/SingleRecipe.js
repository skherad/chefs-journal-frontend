import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import uniqid from 'uniqid';
import axios from 'axios';

import CommentCard from '../../components/CommentCard/CommentCard';
import LoginButton from '../../components/LoginButton/LoginButton';

import "./SingleRecipe.scss"

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const SingleRecipe = () => {

  let navigate = useNavigate()
  let {recipeId, userId} = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // set avatar t pass down to comment section
  const [myAvatar, setMyAvatar] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState([]);
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  // state to get user library
  const [library, setLibrary] = useState([]);
  // state to see if recipe is saved/written by uesr to toggle save button
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Check if user is currently logged in, so we can display a form or login button conditionally
    axios
      .get(`${SERVER_URL}/auth/profile`, { withCredentials: true })
      .then((res) => {
        if (res.data) {
          setIsLoggedIn(true);
          setMyAvatar(res.data.avatar_url)
        }
      });
  }, []);

  // get selected recipe's title, category, instructions
  useEffect(()=>{
    axios.get(`${SERVER_URL}/recipe/singleRecipe/${recipeId}`,  { withCredentials: true })
    .then(res=>setSelectedRecipe(res.data))
    .catch(err => console.log(err))
  },[])
  // get selected recipe's ingredients
  useEffect(() => {
    axios.get(`${SERVER_URL}/ingredient/recipe/${recipeId}`,  { withCredentials: true })
    .then(res=>setRecipeIngredients(res.data))
    .catch(err => console.log(err))
  },[])
  // get ids of user's saved or written ricpes
  useEffect(()=>{
    axios.get(`${SERVER_URL}/recipe/library/${userId}`,  { withCredentials: true })
    .then(res=>setLibrary(res.data.map(e=>e.id)))
    .catch(err => console.log(err))
  },[])

  // post new saved recipe to backend
  const saveHandler = (e) => {
    e.preventDefault();
    let newSave = {
      user_id: userId,
      recipe_id: recipeId
    }
    axios.post(`${SERVER_URL}/recipe/singleRecipe/${recipeId}`, newSave,  { withCredentials: true })
    .then(res => setSaved(true))
    .catch(err => console.log(err))
  }

  const unsaveHandler = (e) => {
    e.preventDefault();
    axios.delete(`${SERVER_URL}/recipe/singleRecipe/${recipeId}`, { withCredentials: true })
    .then(res => setSaved(false))
    .catch(err => console.log(err))
  }

  const deleteHandler = (e) => {
    e.preventDefault();
    axios.delete(`${SERVER_URL}/recipe/singleRecipe/${recipeId}`, { withCredentials: true })
    .then(res=>navigate("/profile"))
    .catch(err=>console.log(err))
  }

  return (
    <>
      {isLoggedIn ? (
        <section className='single-recipe'>
          <div  className='single-recipe__photo' style={{backgroundImage: `url(${selectedRecipe[0]?.photo})`}}></div>
          {!library?.includes(Number(recipeId))&&<button onClick={saveHandler}  className={!saved ? "single-recipe__save-button" :"single-recipe__save-button--disabled"}>SAVE</button>}
          {selectedRecipe[0]?.user_id==userId?
            <button onClick={deleteHandler} className="single-recipe__delete-button">DELETE</button>
            :
            null}
          {saved&&<button className="single-recipe__save-button single-recipe__save-button--done">SAVED✔️</button>}
          <h2 className='single-recipe__header'>{selectedRecipe[0]?.title}</h2>

          {/* render ingredients */}
          <p className='single-recipe__title'>Ingredients:</p>
          <ul className='single-recipe__list'>
            {recipeIngredients.map((e)=>
                <li key={uniqid()} className='single-recipe__item'>{e.name} {e.qty} {e.unit}</li>
            )}
          </ul>

          {/* render instructions */}
          <p className='single-recipe__title'>Instructions:</p>
          <ol className=' single-recipe__list single-recipe__list--instructions'>
            {selectedRecipe[0]?.instructions.split("-").map(step=>
              <li className='single-recipe__item' key={uniqid()}>{step}</li>
            )}
          </ol>
          {/* link to writer's profile */}
          <Link to={`/userProfile/${userId}/${selectedRecipe[0]?.user_id}`} className='single-recipe__title single-recipe__name links'>by: {selectedRecipe[0]?.name}</Link>
          {/* comments component */}
          <CommentCard recipeId={recipeId} userId={userId}  myAvatar={myAvatar}/>
        </section>
      ) : (
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

export default SingleRecipe