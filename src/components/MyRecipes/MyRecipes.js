import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import uniqid from 'uniqid';
import axios from 'axios';

import './MyRecipes.scss'

const SERVER_URL = process.env.REACT_APP_SERVER_URL

const MyRecipes = ({userId, recipes}) => {
  

  return (
    <section className="my-recipes">
      <ul className="recipe__list">
      {/* link to add new recipe page */}
      <Link to={`/newRecipe/${userId}`} className="recipe__card links">
        <li className='recipe__photo-more'>
          <div  className='recipe__title-container'>
          <p className='recipe__title'>Add New Recipe</p>
          </div>
        </li>
      </Link>
      {/* display user's recipes */}
      {recipes?.map(e => {
        return(
          <Link to={`/singleRecipe/${userId}/${e.id}`}  key={uniqid()} className="recipe__card">
            <li className='recipe__item' style={{backgroundImage: `url(${e.photo})`}}>
              <div  className='recipe__title-container'>
              <p className='recipe__title'>{e.title}</p>
              </div>
            </li>
          </Link>
        )
      })}
      </ul>
    </section>
  )
}

export default MyRecipes