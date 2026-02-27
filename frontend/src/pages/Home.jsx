import React, { useContext, useRef, useState } from "react";
import Nav from "../components/Nav";
import dp from "../assets/dp.webp";
import { FiPlus } from "react-icons/fi";
import { FaCamera, FaImage } from "react-icons/fa";
import { UserDataContext } from "../context/UserContext";
import { GoPencil } from "react-icons/go";
import { RxCross2 } from "react-icons/rx"; 
import EditProfile from "../components/EditProfile";
import axios from "axios";
import { AuthDataContext } from "../context/AuthDataContext";
import Post from "../components/Post.jsx";

function Home() {
  let { user, edit, setEdit,postData,setPostdata} = useContext(UserDataContext);
  let {serverURL} = useContext(AuthDataContext)
  // --- FIXED STATES ---
  const [postPopup, setPostPopup] = useState(false); // Was missing
  const [description, setDescription] = useState("");
  const [frontendImage, setFrontendImage] = useState(""); // For preview
  const [backendImage, setBackendImage] = useState("");   // For upload
  let [posting,setPosting]= useState(false)
  
  const imageRef = useRef(); // Renamed for clarity

  // --- HANDLERS ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file)); // Creates a temporary URL for the browser
    }
  };

  async function handleUploadPost(){
    try {
      setPosting(true)
      let formdata= new FormData()
      formdata.append("description",description)

      if(backendImage)
        formdata.append("image",backendImage)

      let result = await axios.post(serverURL+"/api/post/create",formdata,{withCredentials:true})

      setDescription("");
      setBackendImage("");
      setFrontendImage("");
      setPostPopup(false);
      

    } catch (error) {
      console.log(error);
      
    }finally{
      setPosting(false)
    }
  }

  return (
    <div className="w-full min-h-[100vh] bg-[#f9f4f4] pt-[100px] relative flex flex-col lg:flex-row items-start justify-center gap-[20px] px-[20px]">
      
      {edit && <EditProfile />}
      <Nav />

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={imageRef} 
        onChange={handleImageChange} 
        className="hidden" 
        accept="image/*"
      />

      {/* LEFT SIDEBAR */}
      <div className="w-full lg:w-[25%] min-h-[200px] bg-white shadow-lg rounded-lg p-[10px] relative">
        <div onClick={() => setEdit(true)} className="w-[100%] h-[100px] bg-gray-500 rounded overflow-hidden flex items-center justify-center cursor-pointer group relative">
          <img src={user.coverImage || ""} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <FaCamera className="w-[25px] h-[25px] text-white" />
          </div>
        </div>

        <div onClick={() => setEdit(true)} className="w-[70px] h-[70px] rounded-full border-2 border-white overflow-hidden absolute top-[65px] left-[20px] bg-white shadow-md cursor-pointer">
          <img src={user.profileImage || dp} alt="" className="w-full h-full object-cover" />
        </div>

        <div onClick={() => setEdit(true)} className="w-[20px] h-[20px] bg-[#17c1ff] absolute top-[115px] left-[65px] rounded-full flex items-center justify-center cursor-pointer border-2 border-white">
          <FiPlus className="text-white text-xs" />
        </div>

        <div className="mt-[45px] font-semibold text-[19px] pl-[10px] text-gray-700">
          <div>{`${user.firstName} ${user.lastName}`}</div>
          <div className="text-[14px] font-normal text-gray-500 mt-1">{user.headline || "Full stack developer"}</div>
          <div className="text-[13px] font-normal text-gray-400 mt-1 uppercase tracking-wider">{user.location}</div>
          
          <button onClick={() => setEdit(true)} className="w-[100%] h-[36px] mt-[15px] rounded-full border border-[#2dc0ff] text-[#2dc0ff] hover:bg-[#2dc0ff]/10 flex items-center justify-center gap-2 text-sm">
            Edit Profile <GoPencil />
          </button>
        </div>
      </div>

      {/* CENTER SECTION */}
      <div className="w-full lg:w-[50%] flex flex-col gap-4">
        <div className="w-full bg-white shadow-md rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
              <img src={user.profileImage || dp} alt="User" className="w-full h-full object-cover" />
            </div>
            <button 
              onClick={() => setPostPopup(true)}
              className="flex-1 h-12 border border-gray-300 rounded-full text-left px-5 text-gray-500 hover:bg-gray-100 font-medium text-sm"
            >
              Start a post
            </button>
          </div>
        </div>
        {postData.map((post,index)=>(
             <Post key={index} id={post._id} description={post.description} author={post.author} image={post.image} like={post.like} comment={post.comment} />
        ))}
       



      </div>

      {/* POST POPUP */}
      {postPopup && (
        <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4">
          <div className="w-full max-w-[550px] bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Create a post</h2>
              <button onClick={() => setPostPopup(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <RxCross2 className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-4 flex items-center gap-3">
              <img src={user.profileImage || dp} alt="" className="w-12 h-12 rounded-full object-cover" />
              <h3 className="font-semibold text-gray-800">{user.firstName} {user.lastName}</h3>
            </div>

            <div className="px-4 flex-1 overflow-y-auto max-h-[400px]">
              <textarea
                autoFocus
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What do you want to talk about?"
                className="w-full min-h-[120px] text-lg outline-none resize-none placeholder:text-gray-400"
              />
              
              {/* IMAGE PREVIEW BOX */}
              {frontendImage && (
                <div className="relative mt-2 mb-4 border-gray-200 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => {setFrontendImage(""); setBackendImage("")}}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
                  >
                    <RxCross2 />
                  </button>
                  <img src={frontendImage} alt="Preview" className="w-full h-auto" />
              
                </div>
              )}
            </div>

            <div className="p-4 border-t flex items-center justify-between">
              <button 
                onClick={() => imageRef.current.click()} 
                className="p-2 hover:bg-gray-100 rounded-full text-xl text-gray-600"
              >
                <FaImage />
              </button>
              
              <button onClick={handleUploadPost}
                disabled={!description.trim() && !backendImage}
                className={`px-6 py-1.5 rounded-full font-semibold transition-all ${
                  description.trim() || backendImage
                  ? "bg-[#0A66C2] text-white" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {posting ? "Posting":"Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT SIDEBAR */}
      <div className="w-full lg:w-[25%] min-h-[200px] bg-white shadow-lg rounded-lg p-4">
        <h3 className="font-semibold text-gray-700">Add to your feed</h3>
      </div>
    </div>
  );
}

export default Home;