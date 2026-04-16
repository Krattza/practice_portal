import React from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import {useState} from 'react'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    async function handleLogin() {

        console.log(email, password)
        
        try {

            const response = await axios.post('http://localhost:8500/api/users/login', {email, password}, {withCredentials: true})
            console.log(response.data.role)

            if (response.data.role === 'citizen') {
                navigate('/citizen')
            } 

            if (response.data.role === 'department') {
                navigate('/admin')
            } 

        } catch(e) {
            console.log(e)
        }
    }
  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

      <div className="space-y-4">
        {/* Email */}
        <div>
          <input
            onChange={(e)=> setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div>
          <input
          onChange={(e)=> setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Button */}
        <button
        onClick= {handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;