import React, { useContext, useEffect, useState, createContext } from 'react'; // Added createContext
import { AuthDataContext } from './AuthDataContext';
import axios from 'axios';

// 1. Create a NEW unique context for User Data
export const UserDataContext = createContext(); 

function UserContext({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { serverURL } = useContext(AuthDataContext);
  let [edit,setEdit] =useState(false)
  let [postData,setPostData] = useState([])

  const getCurrentUser = async () => {
    // If serverURL hasn't loaded yet, don't make the call
    if (!serverURL) return; 

    try {
      const result = await axios.get(`${serverURL}/api/user/currentuser`, {
        withCredentials: true 
      });
      
      setUser(result.data);
    } catch (error) { 
      console.log(error);
      
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const getPost = async () => {
      try {
        let result =await axios.get(serverURL+"/api/post/getpost",{withCredentials:true})
        console.log(result);
        setPostData(result.data)
        
      } catch (error) {
        console.log(error);
        
      }
  }




  useEffect(() => {
    getCurrentUser();
    getPost()
  }, [serverURL]); // Run when serverURL is ready

  const value = { user, setUser, loading,setLoading,edit,setEdit,postData,setPostData, refreshUser: getCurrentUser };
 
  return (
    // 2. Use UserDataContext here, NOT AuthDataContext
    <UserDataContext.Provider value={value}> 
        {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;