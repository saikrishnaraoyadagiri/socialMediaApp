import { useNavigate } from "react-router-dom";
import "./ProfileEdit.css";
import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import UserService from "../../Services/UserService";
export default function ProfileEdit() {
  const location = useLocation();
  const [userDetails, setUserDetails] = useState(location.state)
  const [image,setImage]  = useState(null);
  const navigate = useNavigate();
      function handleBack(event): void {
        navigate("/profile")
     }
  async function SaveButtonClick(event): Promise<void> {
    console.log("updated user",userDetails);
    try {
      const response = await UserService.update_profile(userDetails["name"],userDetails["bio"],userDetails["gender"],userDetails["email"],userDetails["dob"]);
      const imageres = await UserService.upload_image(image);
      const a=await UserService.getUserProfile(userDetails.userId)
      setUserDetails(a)
      console.log(imageres);
      console.log(response);
      navigate('/profile');
    } catch (error) {
      console.log("err",error)
    }
  }

  const handleChange = (event) => {
    console.log(event,event.target.name,event.target.value);
    setUserDetails({ ...userDetails, [event.target.name]: event.target.value });
    console.log(userDetails)
  };
  const handleImageChange =(event) =>{
    console.log(event,event.target.name,event.target.value);
    const file = event.target.files[0]; 
    console.log(file);

    if (!file.type.match('image/*')) {
      alert('Please select an image file.');
      return;
    }
    setImage(file)
  }

    return (    <div className="first3">
        <div className="profile-header">
        <h1>Edit Profile</h1>
      </div>
        <div >
      <img src={"/assets/user_images"+userDetails.image} alt="Profile picture" className="immagee" />
      <div className="user-details">
        <h2 style={{color:"white"}}>{userDetails.name}</h2>
      </div>
      <div style={{color:"white"}}>Profile Picture:<input style={{color:"black"}} type="file" name= "image" onChange={handleImageChange}/></div>
      <form action="" id="join-us">
    <div className="fields">
      <span className="soeSpan">
       <div style={{color:"white"}}>Name :<input placeholder="Name" type="text" name="name" value={userDetails.name} onChange={handleChange} /></div>
    </span>
    <br />
    <span className="soeSpan">
    <div style={{color:"white"}}>Bio :<input placeholder="Bio" type="text" name="bio" value={userDetails.bio} onChange={handleChange} /></div>
    </span>
    <br />
    <span className="soeSpan">
    <div style={{color:"white"}}>Email :<input placeholder="Email Id" type="email"  name="email" value={userDetails.email} onChange={handleChange}/></div>
    </span >
    <br />
    <span className="soeSpan">
    <div style={{color:"white"}}>DOB :<input placeholder="DOB" type="date" name="dob" value={userDetails.dob} onChange={handleChange} /></div>
    </span>
    </div>
    <div className="submit">
    <button type="button" onClick={SaveButtonClick}>Save</button>
    </div>
  </form>
    </div>
    </div>
    );
}