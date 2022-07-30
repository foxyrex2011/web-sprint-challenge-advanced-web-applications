import React, { useState } from 'react'
import { Navigate, NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axiosWithAuth from '../axios/index'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState(null)
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { /* ✨ implement */
    navigate('/') }
  const redirectToArticles = () => { /* ✨ implement */
    navigate('/articles') }

  const logout = () => {
    if(localStorage.getItem("token")){
      localStorage.removeItem("token")
      setMessage("Goodbye!")
      redirectToLogin()
    }
    else{
      redirectToLogin()
    }
  }

  const login = (username, password) => {
    // ✨ implement
    setMessage("");
    setSpinnerOn(true);
    axios.post(`http://localhost:9000/api/login`, {username: username, password: password})
    .then(res => {
      console.log(res)
      localStorage.setItem("token", res.data.token)
      setMessage(res.data.message)
      redirectToArticles()
      setSpinnerOn(false)
    })
    .catch(err => console.log(err))
  }

  const getArticles = () => {
    // ✨ implement
    setMessage("")
    setSpinnerOn(true)
    axiosWithAuth().get("/articles")
    .then(res => {
      console.log(res)
      setArticles(res.data.articles)
      setMessage(res.data.message)
      setSpinnerOn(false)
    })
    .catch(err => {
      console.log(err)
      setSpinnerOn(false)
    })
  }

  const postArticle = article => {
    setMessage("")
    setSpinnerOn(true)
    axiosWithAuth().post("/articles", {title: article.title, text: article.text, topic: article.topic})
    .then(res => {
      console.log(res)
      setArticles([...articles, res.data.article])
      setMessage(res.data.message)
      setSpinnerOn(false)
    })
    .catch(err => {
      console.log(err)
      setSpinnerOn(false)
    })
    // ✨ implement
  }

  const updateArticle = ( article_id, article ) => {
    setCurrentArticleId(article_id)
    axiosWithAuth().put(`/articles/${article_id}`, {title: article.title, text: article.text, topic: article.topic})
    .then(res => {
      console.log(res)
      setArticles([...articles, res.data.article])
      setMessage(res.data.message)
      setSpinnerOn(false)
    })
    // ✨ implement
    // You got this!
  }

  const deleteArticle = article_id => {
    axiosWithAuth().delete(`/articles/${article_id}`)
    .then(res =>{
      console.log(res)
      setArticles([articles])
      setMessage(res.data.message)
    }   
    )
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner setSpinnerOn={setSpinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            localStorage.getItem("token") ? 
            <> 
              <ArticleForm currentArticle={currentArticleId} setCurrentArticleId={setCurrentArticleId} postArticle={postArticle} updateArticle={updateArticle}/>
              <Articles redirectToArticles={redirectToArticles} articles={articles} getArticles={getArticles} currentArticleId={currentArticleId} setCurrentArticleId={setCurrentArticleId} spinnerOn={spinnerOn} deleteArticle={deleteArticle}/>
            </>
            : <Navigate replace to="/" />
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}