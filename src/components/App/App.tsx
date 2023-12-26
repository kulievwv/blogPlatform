import React, {useEffect} from 'react';
import { ArticlesList } from '../Pages/ArticlesList/ArticlesList';
import {Route, Routes, Navigate, Outlet} from 'react-router-dom'
import { Article } from '../Article/Article';
import { Header } from '../Header/Header';
import classes from './app.module.scss'
import { SignUp } from '../Pages/SignUp/SIgnUp';
import { SigIn } from '../Pages/SignIn/SignIn';
import { EditProfile } from '../Pages/EditProfile/EdtiProfile';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setLoggedIn } from '../../Redux/Slices';
import { CreateArticle } from '../Pages/CreateArticle/CreateArticle';
import { EditArticle } from '../Pages/EditArticle/EditArticle';
import { PageNotFound } from '../Pages/PageNotFound/PageNotFound';



function App() {
  const dispatch = useDispatch();
  const isLoggedIn = !!Cookies.get('token');
  useEffect(() => {
    dispatch(setLoggedIn(isLoggedIn))
  }, [isLoggedIn])
  
  return (
    <>
      <Header/>
      <div className={classes.body}>
        <Routes>
              <Route path='/articles' element={<ArticlesList />}></Route>
              <Route path='/articles/:articleId' element={<Article />}></Route>
              <Route path='/' element={<ArticlesList />} ></Route>
              <Route path='/registration' element={<SignUp />} ></Route>
              <Route path='/authorization' element={<SigIn />} ></Route>
              <Route path='/editProfile' element={<EditProfile />} ></Route>
              <Route path='/createArticle' element={<CreateArticle />} ></Route>
              <Route path='/articles/:articleId/edit' element={<EditArticle />} ></Route>
              <Route path="*" element={<PageNotFound />}></Route>
        </Routes>
      </div>
      
    </>
   

  );
}

export default App;
