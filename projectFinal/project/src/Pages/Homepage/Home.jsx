import React, { useEffect, useState } from 'react'
import "./Home.css"
import PostService from '../../Services/PostService';
import LC from '../LikesComments/LC.tsx';

function Home() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    console.log("fetching posts");
    fetchPosts(0); 
  
    const observer = new IntersectionObserver(entries => {
      if (entries[6] && entries[6].isIntersecting && hasMore) { 
        console.log("hitting omoree",currentPage+1);
        fetchPosts(currentPage + 1);
      }
    });
  
    observer.observe(document.querySelector('#posts-container')); 
  
    return () => observer.disconnect(); 
  }, [hasMore]);
  const fetchPosts = async (page) => {
    console.log("fetcing posts inside",page);
    try {
      setIsLoading(true);
      const x = await PostService.fetchPosts(page,1000);
      // const data = await response.json();
      const data =x.posts
      setCurrentPage(page);
      setPosts(prevPosts => (page ===0 ? data : [...prevPosts, ...data])); 
      setHasMore(data && data.length > 9); 
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const [isCommentsOpen, setIsCommentsOpen] = useState(true);


  return (
    <div className='first'>
  <div id="posts-container">
    {isLoading && <div>Loading...</div>}
    {posts && posts.length>0 && posts.map((post) => (
  <div>
      <div className='postHeader'>
        <img className="user_image" src={ "/assets/user_images/"+
          post.user_image} alt="Profile picture" />
        <div className='user_name'>{post.posted_user_name}</div>
      </div>
        {(post["content_url"] && (!post["content_url"].includes(".mp4") && !post["content_url"]?.includes(".ogg") && !post["content_url"]?.includes(".webm"))) && <img className='post_image' src={"/assets/posts/" + post["content_url"]} alt="Post" />}
        {post["content_url"] && (post["content_url"].includes(".mp4") || post["content_url"].includes(".ogg") || post["content_url"].includes(".webm")) && <video className='post_image' src={ "/assets/posts/"+
          post["content_url"]} controls></video>}
      <div className='titleBox'><div>{post.text_content}</div></div>
      <div className='postFooter'>
        {isCommentsOpen && <LC postId={post.post_id} comment_count={post.comment_count}  liked_post = {post.user_liked} like_count={post.like_count}/>}
        
        </div>
        <br/>
    </div>))}
    </div>
    </div>
  )
}


export default Home
