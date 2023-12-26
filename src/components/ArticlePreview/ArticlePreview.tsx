import React, {useState} from "react";
import { IArticle } from "../../Interfaces/interfaces";
import classes from './articlePreview.module.scss'
import moment from 'moment';
import {HeartOutlined} from '@ant-design/icons'
import { Link } from 'react-router-dom';
import { useLikeArticleMutation, useUnlikeArticleMutation } from "../../API/api";
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { RootState } from "../../Redux/store";


export function setDate(date: string) {
    if (date) {
      const format = moment(date).format('MMMM D, YYYY')
      return format
    }
  }

export const ArticlePreview: React.FC<{ article: IArticle }> = ({ article }) => {

    const isLoggedIn = useSelector((state: RootState) => state.auth.isLogged);
    const [likesCount, setLikesCount] = useState(article.favoritesCount)
    const [liked, setLiked] = useState(article.favorited)
    const [setLike] = useLikeArticleMutation()
    const [setUnlike] = useUnlikeArticleMutation()

    const handleLikeChange = () => {
        if(liked && isLoggedIn){
            setUnlike(article.slug);
            setLiked(false);
            setLikesCount(likesCount - 1);
        }
        else if (!liked && isLoggedIn){
            setLikesCount(likesCount + 1);
            setLike(article.slug);
            setLiked(true)
        }
    }
    return (
        <div className={classes.container} >
            <div className={classes.article}>
                <div className={classes.main}>
                    <div className={classes.header}>
                        <Link to={`/blogPlatform/articles/${article.slug}`} className={classes.title}>{article.title}</Link>
                        <label>
                        <input
                            type="checkbox"
                            className={classes.like}
                            checked={liked && isLoggedIn}
                            onChange={handleLikeChange}
                            disabled={!isLoggedIn}
                        />
                        <span>{likesCount}</span>
                        </label>
                    </div>
                    
                    <ul className={classes.tags}>
                        {article.tagList.map((tag, index) => {
                        return(
                        <li key={tag+index} className={classes.tag}>
                            <a> {tag} </a>
                        </li>
                            )
                    })}
                    </ul> 
                    
                    <div className={classes.content}>
                        {article.description}
                    </div>
                </div>
                    <div className={classes.right}>
                        <div className={classes.meta}>
                            <div className={classes.username}>{article.author.username}</div>
                            <div className={classes.date}>{setDate(article.updatedAt)}</div>
                        </div>
                        <img src={article.author.image} alt={article.author.username} className={classes["profile-pic"]} />
                    </div>
                
            </div>
        </div>
    );
};
