import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthDataContext } from '../context/AuthDataContext';
import logo from '../assets/logo.svg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function Signup() {
    const navigate = useNavigate();
    const { serverURL } = useContext(AuthDataContext);
    const [showPassword, setShowPassword] = useState(false);
    const [loading,setLoading]=useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        
        try {
            const response = await axios.post(`${serverURL}/api/auth/signup`, formData,{withCredentials:true});
            
            if (response.status === 201 || response.status === 200) {
                alert("Account created successfully!");
                navigate('/'); // Redirect to login page
            }
        } catch (error) {
            // Handle errors (email already exists, server down, etc.)
            console.error("Signup Error:", error.response?.data || error.message || setLoading(false));
            alert(error.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#F3F2F0] flex flex-col">
            <div className="p-8">
                <img src={logo} alt="LinkedIn" className="w-32" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4">
                {/* Changed max-w-100 to max-w-md for Tailwind v4 compatibility */}
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                    <h1 className="text-3xl font-semibold mb-6 text-gray-800">Sign Up</h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input type="text" name="firstName" placeholder="First Name" className="w-full p-3 border border-gray-300 rounded-md focus:outline-blue-600" onChange={handleChange} />
                        <input type="text" name="lastName" placeholder="Last Name" className="w-full p-3 border border-gray-300 rounded-md focus:outline-blue-600" onChange={handleChange} />
                        <input type="text" name="userName" placeholder="Username" className="w-full p-3 border border-gray-300 rounded-md focus:outline-blue-600" onChange={handleChange} />
                        <input type="email" name="email" placeholder="Email" className="w-full p-3 border border-gray-300 rounded-md focus:outline-blue-600" onChange={handleChange} />
                        
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="w-full p-3 border border-gray-300 rounded-md focus:outline-blue-600" onChange={handleChange} />
                            <button type="button" className="absolute right-3 top-3 text-blue-600 font-medium hover:underline" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        <button type="submit" className="mt-4 bg-[#0077B5] text-white py-3 rounded-full text-lg font-semibold hover:bg-blue-800 transition shadow-md" disabled={loading}>
                            {loading ?"Loading":"Sign Up"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-600">
                        Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;