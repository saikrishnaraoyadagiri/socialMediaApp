import { useLocation, useNavigate } from "react-router-dom";
import "./Profile.css";
import { useParams } from 'react-router-dom';
import UserService from '../../Services/UserService.js';
import Leftbar from '../../Components/Leftbar/Leftbar.jsx';

import * as React from 'react';
import { useEffect, useState } from "react";
import LC from '../LikesComments/LC.tsx';
import PostService from "../../Services/PostService.js";
import SocialService from "../../Services/SocialService.js";

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  const [showText, setShowText] = useState('');

 

  useEffect(() => {
    fetchData();
  }, [location]);
  const fetchData = async () => {
      const a =await UserService.getUserProfile(userId);
      setUserDetails(a)
      console.log("user",userDetails);
      console.log(a["isFollowing"])
      console.log(userId)
      if((a && a["isFollowing"]==2)){
        fetchPosts();
        setShowText(a["isFollowing"])
      }
      else if (a && a["isFollowing"]==1) {
        setShowText(a["isFollowing"])
      }
      else{
        setShowText("0")
      }
      if(!userId || userId == "0"){
        setShowText("2");
      }
      
  };
  const fetchPosts = async () => {
    try {
      // setIsLoading(true);
      const x = await PostService.getPostsUserWise(userId,0,1000);
      // const data = await response.json();
      const data =x.posts
      // setCurrentPage(page);
      setPosts(data); // Handle initial load and subsequent appends
      // setHasMore(data && data.length > 9); // Update hasMore based on fetched data length
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      // setIsLoading(false);
    }
  }

  async function handleProfileClick(event): Promise<void> {
    console.log("profile click",userId);
    if (userId == null || userId == '0')
      navigate("/updateProfile", { state: userDetails })
  }

  function showUsers(req: string): void {
    if(showText == "2"){
      navigate("/users?req="+req)
    }
  }
  const handleFollowUnfollow = async ()=>{

    const response = await SocialService.followUnFollow(showText=="0" || showText =="4" ?"follow":"unfollow",userId);
    if(showText && (showText=="0" || showText=="4")){
      setShowText("1");

    }else{
      setShowText("0")
    }
} 

  return (<>
    <div className="profile-card">
      <div className="follower-info">
        <img style={{cursor:"pointer"}} src={userDetails && userDetails["image"] ? "/assets/user_images" + userDetails["image"] : ''} alt="Profile picture" className="profile-pic" onClick={handleProfileClick} />
        <div className="follow">
          < div onClick={() => userDetails && userDetails["followersCount"] >0 ?showUsers('followers'):''}>
            <span className="follower-count" >{userDetails ? userDetails["followersCount"] : 0}</span>
            <span style={{cursor:"pointer"}}>Followers</span></div>
          <div  onClick={() => userDetails && userDetails["followingCount"] >0 ?showUsers('following'):''}>
            <span className="following-count" >{userDetails ? userDetails["followingCount"] : 0}</span>
            <span style={{cursor:"pointer"}}>Following</span>
          </div>
        </div>
      </div>
      <div className="profile-info">
        <h2>{userDetails ? userDetails["name"] : "-"}</h2>
        {userId && userId != null && userId != '0' && showText  && <button className="bio" onClick={handleFollowUnfollow}>{showText == "2" ? "Following":showText=="1"?"Requested":"Follow"} </button>}
      </div>
      <div><h4 style={{textAlign:"left"}}>{userDetails ? userDetails["bio"] : "_"}</h4></div>
      {posts.length > 0 && <div >
        <h2>Posts</h2>
          {posts && posts.length>0 && posts.map((post) => (
  <div >
      <div className='postHeader_1'>
        <img className="user_image_1" src={ userDetails && userDetails["image"] ? "/assets/user_images" + userDetails["image"] : ''} alt="Profile picture" />
        <div className='user_name_1'>{userDetails ? userDetails["name"] : "-"}</div>
      </div>
      {/* <img className='post_image_1' src={"/assets/posts/" + post["content_url"]} alt="Post" /> */}
              {post["content_url"] && (() => {
                const contentUrl = `/assets/posts/${post["content_url"]}`;
                if (contentUrl.endsWith(".mp4") || contentUrl.endsWith(".ogg") || contentUrl.endsWith(".webm")) {
                  return <video className='post_image_1' src={contentUrl} controls />;
                } else {
                  return <img className='post_image_1' src={contentUrl} alt="Post" />;
                }
              })()}

      <div className='titleBox_1'><div>{post["text_content"]}</div></div>
      <div className='postFooter_1'>
        {<LC postId={post["post_id"]} comment_count={post["comment_count"]}  liked_post = {post["user_liked"]} like_count={post["like_count"]}/>}
        </div>
        <br/>
    </div>))}

      </div>}
    </div>
    </>
  );
}
