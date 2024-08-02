import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, List } from 'antd'; 
import PostService from '../../Services/PostService';
import "./LC.css"
import UserService from '../../Services/UserService';

function LC({ postId,comment_count, liked_post ,like_count, }) { 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [comments, setComments] =  useState<any[]>([]); ;
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [handle,setHandle] = useState('');
  const [lCount,setLCount] = useState(0);
  const [cCount,setCCount] = useState(0);

  useEffect(() => {
    console.log("postId",postId);
    setLiked(liked_post)
    setLCount(like_count);
    setCCount(comment_count);
  }, []);

  const fetchComments = async () => { 
    setIsModalVisible(true);
    setHandle("comments");

    try {
      const data = await PostService.getComments(postId,0,1000);
      if(data)
        setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  const fetchLikes= async () => { 
    setIsModalVisible(true);
    setHandle("likes");
    try {
      const data = await PostService.getLikes(postId,0,1000);
      if(data)
        setComments(data);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };
  
  const handleAddComment = async ()=>{
    console.log("event",newComment);
    try {
      let data:any = await PostService.addComments(postId,newComment);
      if(data){
        console.log(data);
        let userdata = await UserService.getUserProfile();
        data["user_name"] = userdata["user_name"];
        data["image"] = userdata["image"];
        setComments((prevComments) => [...prevComments, data]);
        setNewComment('');
        setCCount(cCount+1)
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }
  const handleLikeUnLike = async ()=>{
    console.log("event",newComment);
    try {
      let data:any = await PostService.likeUnlike(postId);
      if(data){
        console.log(data);
        let userdata = await UserService.getUserProfile();
        console.log(userdata)
        let newData = {};
        newData["user_name"] = userdata["user_name"];
        newData["image"] = userdata["image"];
        newData["user_id"]=data
        setComments((prevComments) => [...prevComments, newData]);
        setLiked(!liked);
        if(liked){
          setLCount(lCount-1);
        }else{
          setLCount(lCount+1);
        }
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }
  return (
    <>
    {liked == false && <img onClick={handleLikeUnLike}  className ='postFooterImages' src="https://img.icons8.com/?size=100&id=87&format=png&color=000000"/>}
        {liked == true && <img className ='postFooterImages' onClick={handleLikeUnLike} src="https://img.icons8.com/?size=100&id=12306&format=png&color=000000"/>}
        <p onClick={fetchLikes}>{lCount} &nbsp;likes</p>
    <img onClick={ fetchComments} className='postFooterImages' src= "https://img.icons8.com/?size=100&id=118378&format=png&color=000000"/>
    <p >{cCount}&nbsp; comments</p>
    <Modal
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null} 
    >
      <h2>{handle.toLocaleUpperCase()}</h2>
       <List
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={(comment) => (
          <List.Item>
            <List.Item.Meta
              avatar={<img className='imaage' src={"/assets/user_images" + comment["image"]} alt="Profile picture" />}
              title={comment["user_name"]}
            /><br/>
            {comment["comment_text"] && <div className="bordered-box">
            {comment["comment_text"]}
          </div>}
            
          </List.Item>
        )}
      />{handle=='comments' && <>
      <Input.TextArea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write your comment..."
        autoSize={{ minRows: 2, maxRows: 5 }}
      />
      <Button type="primary" onClick={handleAddComment} disabled={!newComment}>
        Add Comment
      </Button></>}
    </Modal>
    </>
  );
}

export default LC;

