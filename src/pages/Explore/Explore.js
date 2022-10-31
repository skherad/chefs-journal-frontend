import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom";
import uniqid from 'uniqid';
import axios from "axios";

import LoginButton from "../../components/LoginButton/LoginButton";

import './Explore.scss'

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Explore = () => {

  let {userId} = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [exploreRecipes, setExploreRecipes] = useState([]);
  const [exploreUsers, setExploreUsers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  // state to toggle between explore chefs or recipes
  const [viewRecipes, setViewRecipes] = useState(true);

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

  // request to server to get recipes that are not saved or created by the user
  useEffect(()=>{
    axios.get(`${SERVER_URL}/recipe/explore/${userId}`)
    .then(res => setExploreRecipes(res.data))
    .catch(err => console.log(err))
  },[])

  // request to server to get other users
  useEffect(()=>{
    axios.get(`${SERVER_URL}/user/explore/${userId}`)
    .then(res => setExploreUsers(res.data))
    .catch(err => console.log(err))
  },[])

  // handler to toggle explore recipe/user
  const viewRecipeHandler = () => {
    setViewRecipes(true)
  }

  // handler to toggle explore recipe/user
  const viewUserHandler = () => {
    setViewRecipes(false)
  }

  return (
    <>
    {isLoggedIn ? (
        <section className="explore">
        {/* show nav bar */}
        <div className="explore__nav">
          <div onClick={()=>viewRecipeHandler()} className={!viewRecipes ? "explore__item" :"explore__item explore__item--active"}>Explore Recipes</div>
          <div onClick={()=>viewUserHandler()} className={viewRecipes ? "explore__item" :"explore__item explore__item--active"}>Explore Chefs</div>
        </div>
        {/* conditional rendering based on state of view recipes */}
        {viewRecipes?(
            <>
            {/* category buttons */}
            <div className="explore__category-container">
              <button 
                onClick={()=> (selectedCategory === "Breakfast")?setSelectedCategory("All"): setSelectedCategory("Breakfast")} 
                className={(selectedCategory === "Breakfast")?"explore__category-button explore__category-button--active":"explore__category-button"}
              >Breakfast</button>
              <button 
                onClick={()=> (selectedCategory === "Lunch")?setSelectedCategory("All"): setSelectedCategory("Lunch")}
                className={(selectedCategory === "Lunch")?"explore__category-button explore__category-button--active":"explore__category-button"}
              >Lunch</button>
              <button 
                onClick={()=> (selectedCategory === "Dinner")?setSelectedCategory("All"): setSelectedCategory("Dinner")}
                className={(selectedCategory === "Dinner")?"explore__category-button explore__category-button--active":"explore__category-button"}
              >Dinner</button>
              <button 
                onClick={()=> (selectedCategory === "Dessert")?setSelectedCategory("All"): setSelectedCategory("Dessert")}
                className={(selectedCategory === "Dessert")?"explore__category-button explore__category-button--active":"explore__category-button"}
              >Dessert</button>
            </div>
            {/* show recipes list */}
            <ul className="recipe__list">
              {/* filter recipes based on category selected */}
              {(selectedCategory==="All")? exploreRecipes.map((e) => {
                  return(
                    <Link  to={`/singleRecipe/${userId}/${e.id}`}  key={uniqid()}  className="recipe__card">
                      <li className='recipe__item' style={{backgroundImage: `url(${e.photo})`}}>
                        <div  className='recipe__title-container'>
                          <p className='recipe__title'>{e.title}</p>
                        </div>
                      </li>
                    </Link>
                  )
                }):
                  exploreRecipes.filter(e=>e.category === selectedCategory).map((e) => {
                    return(
                    <Link  to={`/singleRecipe/${userId}/${e.id}`}  key={uniqid()}  className="recipe__card">
                        <li className='recipe__item' style={{backgroundImage: `url(${e.photo})`}}>
                          <div  className='recipe__title-container'>
                          <p className='recipe__title'>{e.title}</p>
                        </div>
                      </li>
                    </Link>
                  )
                })}
            </ul>
            </>
          ):(
            // render explore users if view recipe state is false
            <ul className="explore__user-container">
            {exploreUsers.map((e) => {
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
        )}
      </section>
      ):(
        // If user is not logged in, render a login button
        <section className="home">
          <p>
            <strong>This page requires authentication.</strong>
          </p>
          <LoginButton />
        </section>
      )}
    </>
  )
}

export default Explore