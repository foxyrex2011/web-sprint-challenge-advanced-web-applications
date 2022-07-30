import React, { useState, useEffect } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import PrivateRoute from './PrivateRoute'
import axios from 'axios'
import { axiosWithAuth } from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  const navigate = useNavigate()

  const redirectToLogin = () => {
    navigate("/")
  }

  const redirectToArticles = () => {
    navigate("articles")
  }

  const logout = () => {
    localStorage.removeItem("token");
    setMessage("Goodbye!")
    redirectToLogin()
  }

  const login = ({ username, password }) => {
    setSpinnerOn(true)
    axios.post(loginUrl, {username: username, password: password})
      .then(res => {
        localStorage.setItem("token", res.data.token);
        setMessage(res.data.message);
        redirectToArticles()
        setSpinnerOn(false)
      })
      .catch(err => console.error(err))
  }

  const getArticles = () => {
    axiosWithAuth().get(articlesUrl)
      .then(res => {
        setArticles(res.data.articles);
        setMessage(res.data.message);
      })
      .catch(err => logout())
      .finally(setSpinnerOn(false));
  }

  const postArticle = article => {
    axiosWithAuth().post(articlesUrl, article)
      .then(res => {
        setMessage(res.data.message);
        setArticles([...articles, res.data.article])
      })
      .catch(err => console.error(err))
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!

    axiosWithAuth().put(`${articlesUrl}/${article_id}`, article)
      .then(res => {
        setMessage(res.data.message);
        const filterArt = articles.filter(ar => ar.article_id !== article_id)
        setArticles([...filterArt, res.data.article])
      })
      .catch(err => {
        setMessage(err.response.data.message)
      })
  }

  const deleteArticle = article_id => {
    // ✨ implement
    axiosWithAuth().delete(`${articlesUrl}/${article_id}`)
      .then(res => {
        setMessage(res.data.message);
        const filtered = articles.filter(ar => ar.article_id !== article_id);
        setArticles([...filtered]);
    })
      .catch(err => console.error(err))
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} setSpinnerOn={setSpinnerOn} />} />
          <Route path="articles" element={
            <PrivateRoute>

              <ArticleForm 
                articles={articles} 
                setCurrentArticleId={setCurrentArticleId} 
                currentArticle={articles.find(ar => ar.article_id === currentArticleId)} 
                postArticle={postArticle} 
                updateArticle={updateArticle} 
              />

              <Articles 
                getArticles={getArticles} 
                articles={articles} 
                setCurrentArticleId={setCurrentArticleId}
                deleteArticle={deleteArticle}
              />

            </PrivateRoute>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}