import './EditRecipe.scss';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import uniqid from 'uniqid';
import axios from "axios";
import Select from 'react-select';
import LoginButton from '../../components/LoginButton/LoginButton';


const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const EditRecipe = () => {
    let {recipeId, userId} = useParams();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [ingredientsArray, setIngredientsArray] = useState([]);
    const [state, setState] = useState(
        {
          title: "",
          category:"",
          instructions: ""
        }
      )
    // state to set ingredients inputed by the user
    const [fields, setFields] = useState([
        {
        id: 1, 
        qty: "",
        unit: "",
        value: "",
        label:""
        }
    ])

    // request to check user is logged in
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
    // request to get ingredients from back end and set the array for select options
    useEffect(()=>{
        axios.get(`${SERVER_URL}/ingredient`,  { withCredentials: true })
            .then(res=>{
            let result = [];
            res.data?.map(ingredient=>result.push({value: ingredient.id, label:ingredient.name}))
            setIngredientsArray(result)
            })
    },[])
    // get selected recipe's title, category, instructions
    useEffect(()=>{
        axios.get(`${SERVER_URL}/recipe/singleRecipe/${recipeId}`,  { withCredentials: true })
        .then(res=> {
            setState({
                title: res.data[0].title,
                category: res.data[0].category,
                instructions: res.data[0].instructions
            })
        })
        .catch(err => console.log(err))
    },[])
    // get selected recipe's ingredients
    useEffect(() => {
        axios.get(`${SERVER_URL}/ingredient/recipe/${recipeId}`,  { withCredentials: true })
        .then(res=>
            {
                let result=[];
                res.data?.map((recipeIngredient,i)=>result.push(
                    {
                        id: i+1, 
                        qty: recipeIngredient.qty,
                        unit: recipeIngredient.unit,
                        value: recipeIngredient.ingredient_id,
                        label: recipeIngredient.name
                    }
                ))
                setFields(result)
            })
        .catch(err => console.log(err))
    },[])
    // change handler for ingredient's unit and qty input by user
  const ingredientHandler = (i, e) => {
    const values = [...fields];
    values[i][e.target.name] = e.target.value;
    setFields(values)
  }
  // change handler for ingredient input by user
  const selectedIngredient = (i,e) =>{
    const values = [...fields];
    values[i].value=e.value;
    values[i].label= e.label;
    setFields(values)
  }
    const submitHandler = (e) => {
        e.preventDefault();
        let updateRecipe = {
        id: recipeId,
        title: state.title,
        instructions: state.instructions,
        user_id: userId,
        category: state.category,
        ingredients: fields
        };
        axios.put(`${SERVER_URL}/recipe`, updateRecipe,  { withCredentials: true })
        .then(res=>navigate(`/profile`))
        .catch(err=> console.log(err))
    }
    // cancel button navigator
    const cancelHandler = () => {
        navigate(`/profile`)
    }
    // add handler for aditional ingredient fields
    const addHandler = () => {
        setFields([...fields, {
        id: uniqid(), 
        qty: 0,
        unit: ""
        }])
    }
    // remove handler for removing ingredient fields
    const removeHandler = (i) => {
        const values = [...fields]
        values.splice(i, 1)
        setFields([...values])
    }

    const changeHandler = (e) => {
        const value = e.target.value;
        setState(
            {
                ...state,
                [e.target.name]:value
            }
        )
    }

  return (
     <section className="new-recipe">
      {isLoggedIn?(
        <form className="form" onSubmit={submitHandler}>
          {/* upload a photo */}
          <label htmlFor="foodPic" className="form__label">Choose file to upload - accepted types: .jpg, .jpeg, .png</label>
          <input type="file" id="foodPic" name="foodPic" accept=".jpg, .jpeg, .png" className="form__input-file"></input>

          {/* add title */}
          <label htmlFor="title" className="form__label">Title:</label>
          <input 
            name="title" 
            id="title" 
            placeholder={state?.title}
            className="form__input" 
            value={state?.title} 
            onChange={changeHandler}
          ></input>
          
          {/* add ingredients */}
          <label htmlFor="ingredient" className="form__label">Ingredients:</label>

          {fields.map((field,i) => (
            <div className="form__ingredient-card">
              <button type="button" onClick={()=>removeHandler(i)}  className="form__remove"></button>
              <Select name="ingredient" options={ingredientsArray} className="form__select-ingredient" value={field.ingredient} placeholder={field.label} onChange={e=>selectedIngredient(i,e)}/>
              <div  className="form__qty-container">
                <input name="qty" id="qty" placeholder="Qty" className="form__input form__input--short " value={field.qty} onChange={e=>ingredientHandler(i,e)}></input>
                <input name="unit" id="unit" placeholder="Unit" className="form__input form__input--short" value={field.unit} onChange={e=>ingredientHandler(i,e)}></input>
              </div>
            </div>
          )
          )} 
          {/* add additional ingredients fields */}
          <button type="button" onClick={()=>addHandler()} className="form__add">+</button>

          {/* select category */}
          <select value={state?.category} onChange={changeHandler} name="category" className="form__select">
            <option value="" disabled hidden className="form__placeholder">Select Category...</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Dessert">Dessert</option>
          </select>

          {/* add instructions */}
          <label htmlFor="instructions" className="form__label">Instructions:</label>
          <textarea name="instructions" id="instructions" placeholder="Type instructions..." className="form__textarea" value={state?.instructions} onChange={changeHandler}></textarea>
          
          {/* submit the form */}
          <div className="form__button-container">
            <button type="reset" onClick={cancelHandler} className="form__cancel">cancel</button>
            <button type="submit" className="form__submit">save</button>
          </div>
          </form>
      ):(
        // If user is not logged in, render a login button
        <section className="home">
          <p>
            <strong>This page requires authentication.</strong>
          </p>
          <LoginButton />
        </section>
      )}
    </section>
  )
}

export default EditRecipe