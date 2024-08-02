import { useState, useEffect,useRef } from "react";
import "./Post.css";
import UserService from '../../Services/UserService';
import PostService from "../../Services/PostService";
import LC from "../LikesComments/LC.tsx";


function Post() {
    const [userData, setUserData] = useState('');
    const [image,setImage] = useState('');
    const [content,setContent] = useState('');
    const fileInputRef = useRef(null); 
    const [posts, setPosts] = useState([]);




    useEffect(() => {
        getUserData(); 
        fetchPosts();    
    }, []);

    const fetchPosts = async () => {
        try {
          const x = await PostService.getPostsUserWise(userData.user_id,0,1000);
          const data =x.posts
          setPosts(data); 
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
        }
      }
    
    const handleImageChange =(event) =>{
        console.log(event,event.target.name,event.target.value);
        const file = event.target.files[0];
        console.log(file);
        setImage(file)
      }

    const handleTextChange= (event)=>{
        setContent(event.target.value)
        console.log("evne",event.target.value);
      }
    const getUserData = async () => {
        setUserData(await UserService.getUserProfile());
        console.log("user", userData)
    }

    const submit = async(event)=>{
        event.preventDefault()
        if (!image && !content) {
            console.log('No content or image to post.');
            return; 
        }
    
        let formData = new FormData();
        console.log("content",content)
        setContent(content === null ? '' : content);
         formData.append('image', image);
         formData.append('text',content);
         console.log("content empty",content)
         console.log("form data",formData)
        try {

            let data = await PostService.addPost(formData);
            if(data){
              console.log(data);
              setImage('');
              setContent(null);
               if (fileInputRef.current) {
                 fileInputRef.current.value = '';
             }
             fetchPosts();

            }
          } catch (error) {
            console.log("form",formData)

            console.error('Error fetching comments:', error);
          }
    }
    return (
        <div>
        <div className="post-container">
            <div className="profile-pic">
                <img src={userData ? "/assets/user_images" + userData["image"] : ''} alt="Profile Picture" />
            </div>
            <div className="post-form">
                <textarea name="post-text" id="post-text" placeholder="What's on your mind?" onChange={handleTextChange} value={content == null ? '  ' : content}></textarea>
                <div className="post-options">
                
                    <input type="file" id="add-photo-input" accept="image/*,video/*" onChange={handleImageChange} ref={fileInputRef}  />

                    
                </div>
                <button  id="post-btn" onClick={submit}>Post</button>
                </div>
        </div>
        <div className="profile-card">
      {posts.length<=0 && <h1>No Posts available</h1>}
      {posts.length > 0 && (<div >
        <h2>Posts</h2>
          {posts && posts.length>0 && posts.map((post) => (
  <div >
      <div className='postHeader_1'>
        <img className="user_image_1" src={ userData && userData["image"] ? "/assets/user_images" + userData["image"] : ''} alt="Profile picture" />
        <div className='user_name_1'>{userData ? userData["name"] : "-"}</div>
      </div>
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

      </div>)}
    </div>
        </div>
    );

}

export default Post