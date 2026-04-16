import React from 'react'
import axios from 'axios'
import Hero from '../components/home/Hero.jsx'
import Navbar from '../components/home/Navbar.jsx'
import { useState } from 'react'

const Home = ({setEmail}) => {

    const [showRegister, setShowRegister] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
  return (
    <>

    <Navbar setEmail={setEmail} setShowRegister={setShowRegister} setShowLogin={setShowLogin} />
    <Hero setEmail={setEmail}/>
    </>
  )
}

export default Home