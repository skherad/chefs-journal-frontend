import { useState, useEffect } from "react";
import axios from "axios";
import uniqid from 'uniqid'
import sendIcon from '../../assets/images/send.svg';
import './CommentCard.scss'

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const CommentCard = ({recipeId, userId, myAvatar}) => {
    
    // state to set comments
    const [recipeComments, setRecipeComments] = useState([]);

    // axios call to get comments from server
    useEffect(() => {
        axios.get(`${SERVER_URL}/comment/recipe/${recipeId}`, { withCredentials: true })
        .then(res=>setRecipeComments(res.data))
        .catch(err => console.log(err))
        },[])
    
    // handler to post new comments
    const commentHandler = (e) => {
        e.preventDefault();

        let newComment = {
            content: e.target.comment.value, 
            user_id: userId,
            recipe_id: recipeId
        }
        // post request to server to add new comment
        axios.post(`${SERVER_URL}/comment`, newComment,  { withCredentials: true })
        .then(res=> 
            axios.get(`${SERVER_URL}/comment/recipe/${recipeId}`)
            .then(res=>setRecipeComments(res.data))
            .catch(err => console.log(err))
        )
        e.target.reset();

    }

  return (
    <section className="comment">
        <h3 className="comment__title">comments:</h3>
            {/* <CommentForm /> */}
            <form onSubmit={commentHandler} className="comment__form">
                <div  className='avatar  comment__form-avatar' style={{backgroundImage: `url(${myAvatar})`}}></div>
                <textarea name="comment" id="comment" placeholder="Add comment..." className="comment__textarea" maximum-scale="1"></textarea>
                <button type="submit" className="comment__send"><img src={sendIcon}></img></button>
            </form>
            {/* comment cards */}
            {recipeComments?.map((e)=>
                <div key={uniqid()} className="comment__card">
                    <div  className='avatar' style={{backgroundImage: `url(${e.avatar_url})`}}></div>
                    <div className="comment__card-container">
                        <div  className="comment__card-container-inner">
                            <p className="comment__card-name">{e.name}</p>
                            <p className="comment__card-date">{e.updated_at.slice(0,10)}</p>
                        </div>
                        <p className="comment__card-text">{e.content}</p>     
                    </div>               
                </div>
            )}
    </section>
  )
}

export default CommentCard