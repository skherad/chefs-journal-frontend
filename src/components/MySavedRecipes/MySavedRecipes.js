import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import uniqid from 'uniqid';
import axios from 'axios';

import './MySavedRecipes.scss'

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const MySavedRecipes = ({userId, savedRecipes}) => {


  return (
    <section className='saved'>
      <ul className="recipe__list">
        {savedRecipes?.map(e => 
          <>
            <Link to={`/singleRecipe/${userId}/${e.recipe_id}`}  key={uniqid()}  className="recipe__card">
            <li className='recipe__item' style={{backgroundImage: `url(${e.photo})`}}>
              <div  className='recipe__title-container'>
              <p className='recipe__title'>{e.title}</p>
              </div>
            </li>
            </Link>
          </>
        )}
      </ul>
    </section>
  )
}

export default MySavedRecipes