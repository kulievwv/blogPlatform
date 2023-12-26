import React, { useState, useEffect } from "react";
import classes from './article.module.scss'
import { setDate } from "../ArticlePreview/ArticlePreview";
import { useDeleteArticleMutation, useGetArticleByIdQuery } from "../../API/api";
import { useNavigate, useParams } from 'react-router-dom';
import Markdown from 'react-markdown'
import Loading from "../Loading/loading";
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { RootState } from "../../Redux/store";
import { useLikeArticleMutation, useUnlikeArticleMutation } from "../../API/api";
import { PageNotFound } from "../Pages/PageNotFound/PageNotFound";
import { Popconfirm, message } from 'antd'

export const Article: React.FC = () => {
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLogged);
    const { articleId } = useParams<{ articleId: string }>();
    const { data, isError, error, isLoading } = useGetArticleByIdQuery({ id: articleId });
    const isOwnArticle = data?.article.author.username === Cookies.get('username');
    const [deleteArticle] = useDeleteArticleMutation();
    const navigate = useNavigate()

    const [setLike] = useLikeArticleMutation()
    const [setUnlike] = useUnlikeArticleMutation()
    const [likesCount, setLikesCount] = useState<number | undefined>(undefined);
    const [liked, setLiked] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        setLikesCount(data?.article.favoritesCount);
        setLiked(data?.article.favorited);
    }, [data]);

    const removeArticle = () => {
        if (articleId !== undefined) {
            const sure = window.confirm('Are you sure to delete this article?')
            if (sure) {
                deleteArticle(articleId)
                    .then(() => navigate('/blogPlatform/articles', { replace: true }))
                    .catch((error) => console.error('Failed to delete the article:', error));
                navigate('/blogPlatform/articles', { replace: true })
            }
        } else {
            console.error('Article ID is undefined');
        }
    }

    const editArticle = () => {
        navigate(`/blogPlatform/articles/${articleId}/edit`)
    }

    const handleLikeChange = async () => {
        if (liked && data && isLoggedIn) {
            setLiked(false);
            setLikesCount((prevCount) => prevCount !== undefined ? prevCount - 1 : undefined)
            await setUnlike(data.article.slug);
        } else if (!liked && data && isLoggedIn) {
            setLiked(true);
            setLikesCount((prevCount) => prevCount !== undefined ? prevCount + 1 : undefined);
            await setLike(data.article.slug);
        }
    }

    if (isLoading) {
        return (<Loading />)
    }
    if (isError) {
        return (<PageNotFound />)
    }
    if (!isLoading && data) {
        return (
            <div className={classes.container} >
                <div className={classes.article}>
                    <div className={classes.main}>
                        <div className={classes.header}>
                            <a href='#' className={classes.title}>{data.article.title}</a>
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
                            {data.article.tagList?.map((tag, index) => {
                                return (
                                    <li key={tag + index} className={classes.tag}>
                                        <a> {tag} </a>
                                    </li>
                                )
                            })}
                        </ul>
                        <div className={classes.description}>
                            {data.article.description}
                        </div>
                        <div className={classes.body}>
                            <Markdown>{data.article.body}</Markdown>
                        </div>
                    </div>
                    <div className={classes.right}>
                        <div className={classes.rightTop}>
                            <div className={classes.meta}>
                                <div className={classes.username}>{data.article.author.username}</div>
                                <div className={classes.date}>{setDate(data.article.updatedAt)}</div>
                            </div>
                            <img src={data.article.author.image} alt={data.article.author.username} className={classes["profile-pic"]} />
                        </div>
                        {isOwnArticle ? <div className={classes.buttons}>
                            <button
                                className={classes.delete}
                                onClick={removeArticle}>
                                Delete
                            </button>
                            <button
                                className={classes.edit}
                                onClick={editArticle}
                                type="button">
                                Edit
                            </button>
                        </div> : null}
                    </div>
                </div>
            </div>
        )
    } else {
        return (<h1>Something went wrong</h1>)
    }
}
