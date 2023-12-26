import React, {useState, useEffect} from "react";
import classes from './header.module.scss'
import { Link, useNavigate } from "react-router-dom";
import { useGetCurrentUserInfoQuery } from "../../API/api";
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { RootState } from "../../Redux/store";
import { setLoggedIn } from "../../Redux/Slices";

export const Header: React.FC = () =>{
    
    const token:string = Cookies.get('token') || '';
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLogged);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const noImage = 'https://memedia.ru/ic/dog.png'

    const {data, error} = useGetCurrentUserInfoQuery(token, {
        skip: !token
    })
    useEffect(() => {
        Cookies.set('username',data?.user.username || '' , { expires: 7, path: '/' })
    },[data?.user.username])

    const logOut = () => {
        Cookies.remove('token');
        dispatch(setLoggedIn(false))
    }

    if(isLoggedIn){
        return(
        <div className={classes.header}>
            <Link to='/blogPlatform/articles' className={classes.title}>Putin Vor Blog</Link>
            <div className={classes.sign}>
                <Link to='/blogPlatform/createArticle' className={classes.create}>Create article</Link>
                <Link to='/blogPlatform/editProfile' >
                    <div className={classes.username}>{data?.user.username}</div> 
                </Link>
  
                <Link to='/blogPlatform/editProfile' >
                    <img src={data?.user?.image || noImage} alt={'no image'} className={classes.image}></img>
                </Link>
                <button className={classes.out} onClick={() =>logOut()}>Log out</button>
            </div>
        </div>
        )
    }
    else{
        return(
            <div className={classes.header}>
                <Link to='/blogPlatform/articles' className={classes.title}>Putin Vor Blog</Link>
                <div className={classes.sign}>
                    <Link to='/blogPlatform/authorization' className={classes.in}>Sign In</Link>
                    <Link to='/blogPlatform/registration' className={classes.up}>Sign Up</Link>
                </div>
            </div>
        )
    }
    
}