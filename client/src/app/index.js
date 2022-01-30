import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { NavBar } from '../components'
import { MoviesList, MoviesInsert, MoviesUpdate } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
      <Router>
          <NavBar />
          <Routes>
              <Route path="/movies/list" exact element={<MoviesList />}></Route>
              <Route path="/movies/create" exact element={<MoviesInsert />}></Route>
              <Route path="/movies/update/:id" exact element={<MoviesUpdate />}></Route>
          </Routes>
      </Router>
  )
}

export default App