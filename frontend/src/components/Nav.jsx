import React, { useContext, useState } from "react";
import logo2 from "../assets/logo2.png";
import { CiSearch } from "react-icons/ci";
import { IoHomeSharp } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import dp from "../assets/dp.webp";
import { UserDataContext } from "../context/UserContext.jsx";
import { AuthDataContext } from "../context/AuthDataContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Nav() {
  let { user,setUser } = useContext(UserDataContext);
  let [showPopUp,setShowPopUp]=useState(false)
  let navigate=useNavigate()

  let {serverURL} = useContext(AuthDataContext)
  const handleSignOut=async()=>{
      try {
        let result=await axios.get(serverURL+"/api/auth/logout",{withCredentials:true})
        console.log(result);
        setUser(null)
        navigate("/login")
        
      } catch (error) {
        console.log(error);
        
      }
  }

  return (
    <nav className="w-full h-[64px] fixed top-0 z-50 shadow-md bg-white flex justify-around items-center px-4">
      <div className="w-full max-w-[1128px] flex justify-between items-center h-full">
        {/* LEFT: Logo and Search */}
        <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
          <img
            className="w-[34px] h-[34px] object-contain"
            src={logo2}
            alt="Logo"
          />

          <form
            className={`flex items-center w-full max-w-[280px] h-[34px] bg-[#edf3f8] rounded-md gap-2 px-3 border border-transparent focus-within:border-black transition-all`}
          >
            <CiSearch className="text-gray-600 text-lg flex-shrink-0" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder-gray-500"
              type="text"
              placeholder="Search..."
            />
          </form>
        </div>

        {/* RIGHT: Navigation Items */}
        <div className="flex justify-end items-center h-full space-x-4 md:space-x-8 relative">

          {showPopUp &&  <div className="w-[330px] min-h-[300px] bg-white shadow-lg absolute top-[75px] rounded-lg flex flex-col items-center p-[20px] gap-[20px] ">
            <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
              <img src={dp} alt="" className="w-full h-full" />
            </div>
            <div className="text-[19px] font-semibold text-gray-700">
              {`${user.firstName} ${user.lastName} `}
            </div>
            <button className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] ">
              View Profile
            </button>
            <div className="w-full h-[1px] bg-gray-700"></div>
            <div className="w-full flex items-center justify-start text-gray-500 gap-2 hover:text-black cursor-pointer min-w-[80px]">
              <FaUsers className="text-2xl" />
              <span className="text-[12px]">My Network</span>
            </div>
            <button onClick={handleSignOut} className="w-[100%] h-[40px] rounded-full border-2 border-[#ff5e2d] text-[#ff532d] ">
              Sign Out
            </button>
          </div>}
         

          {/* HOME - Hidden on mobile, flex on medium screens+ */}
          <div className="hidden md:flex flex-col items-center justify-center text-gray-500 hover:text-black cursor-pointer min-w-[80px]">
            <IoHomeSharp className="text-2xl" />
            <span className="text-[12px]">Home</span>
          </div>

          {/* NETWORK - Hidden on mobile, flex on medium screens+ */}
          <div className="hidden md:flex flex-col items-center justify-center text-gray-500 hover:text-black cursor-pointer min-w-[80px]">
            <FaUsers className="text-2xl" />
            <span className="text-[12px]">My Network</span>
          </div>

          {/* NOTIFICATIONS - Always visible */}
          <div className="flex flex-col items-center justify-center text-gray-500 hover:text-black cursor-pointer min-w-[40px] md:min-w-[80px]">
            <IoIosNotifications className="text-2xl" />
            <span className="text-[12px] hidden md:block">Notifications</span>
          </div>

          {/* PROFILE */}
          <div className="flex flex-col items-center cursor-pointer min-w-[60px] border-l border-gray-200 pl-4">
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <img
                onClick={()=>{setShowPopUp(prev=>!prev)}}
                className="w-full h-full object-cover"
                src={user.profileImage || dp}
                alt="Profile"
              />
            </div>
            <span className="text-[12px] text-gray-600 hidden sm:block">
              Me
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
