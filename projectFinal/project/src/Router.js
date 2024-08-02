import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './Pages/Register/Register.jsx'; // Import your Register component
import Profile from './Pages/Profile/Profile.tsx';
import ProfileEdit from './Pages/ProfileEdit/ProfileEdit.tsx';
import Home from './Pages/Homepage/Home.jsx';
import Users from './Pages/Users/Users.jsx';
import Post from './Pages/AddPost/Post.jsx';
function Router() { 
  const userData = localStorage.getItem('authToken');
  console.log("user",userData,userData?"hi":"lo")
  return (
      <Routes>
        <Route path="/" element={userData ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Register />} />
        <Route path="/profile" element= {<Profile/>}/>
        <Route path="/profile/:userId" element= {<Profile/>}/>
        <Route path= "/updateProfile" element = {<ProfileEdit/>}/>
        <Route path="/home" element={<Home />} />
        <Route path = "/users" element= {<Users/>} />
        <Route path = "/users/:userId" element= {<Users/>} />
        <Route path = "/post" element= {<Post/>}/>
        
        <Route path="/" element={userData ? <Navigate to="/home" /> : <Navigate to="/login" />} />
      </Routes>
  );
}

export default Router;
