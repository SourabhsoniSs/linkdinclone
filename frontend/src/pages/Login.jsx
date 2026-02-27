import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthDataContext } from '../context/AuthDataContext';
import logo from '../assets/logo.svg';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';

function Login() {
    const navigate = useNavigate();
    let {setUser}=useContext(UserDataContext)
    const { serverURL } = useContext(AuthDataContext);
    
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    
    // 1. Simplified state: Only need email and password for login
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // 2. Updated endpoint to /login
            const response = await axios.post(`${serverURL}/api/auth/login`, formData, { withCredentials: true });
            
            if (response.status === 200) {
                alert("Login successful!");
                setUser(response.data);
                // 3. Usually, you redirect to the home page or feed after login
                navigate('/'); 
            }
        } catch (error) {
            console.error("Login Error:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            // 4. Always turn off loading whether it succeeds or fails
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#F3F2F0] flex flex-col">
            <div className="p-8">
                <img src={logo} alt="LinkedIn" className="w-32" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                    <h1 className="text-3xl font-semibold mb-2 text-gray-800">Sign in</h1>
                    <p className="text-gray-600 mb-6">Stay updated on your professional world</p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Email Input */}
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email" 
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-blue-600" 
                            onChange={handleChange} 
                            required 
                        />
                        
                        {/* Password Input */}
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password" 
                                placeholder="Password" 
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-blue-600" 
                                onChange={handleChange} 
                                required 
                            />
                            <button 
                                type="button" 
                                className="absolute right-3 top-3 text-blue-600 font-medium hover:underline" 
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        <button 
                            type="submit" 
                            className="mt-4 bg-[#0077B5] text-white py-3 rounded-full text-lg font-semibold hover:bg-blue-800 transition shadow-md disabled:bg-gray-400" 
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    {/* Redirect to Signup instead */}
                    <p className="mt-6 text-center text-gray-600">
                        New to LinkedIn? <Link to="/signup" className="text-blue-600 font-semibold hover:underline">Join now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;