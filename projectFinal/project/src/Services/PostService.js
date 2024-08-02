class PostService {
  static async getPostsUserWise(userId,page_no,page_size) {
    let url ="http://localhost:5000/fetch/profile/posts";
        url += "?page_size=" + page_size + "&page_no=" + page_no;
        if(userId){
          url+= "&user_id=" + userId;
        }
        return await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' ,
             'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
        }).then(async response => {
          console.log(response);
          const data = await response.json(); 
  
          if (!response.ok && data && data.error) { 
                  console.error('Error message:', data.error);
                  throw new Error(data.error);
              } else if(!response.ok) {
                  console.error('Unexpected response format:', data);
                  throw new Error("Unexpected error ");
              }
              console.log("data",data);
          return data;
        })
  }
    static async fetchPosts(page_no,page_size) {
      console.log("fetching posts inside post",page_no,page_size);
        let url ="http://localhost:5000/fetch/posts";
        url += "?page_size=" + page_size + "&page_no=" + page_no;
        return await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' ,
             'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
        }).then(async response => {
          console.log(response);
          const data = await response.json(); 
  
          if (!response.ok && data && data.error) { 
                  console.error('Error message:', data.error);
                  throw new Error(data.error);
              } else if(!response.ok) {
                  console.error('Unexpected response format:', data);
                  throw new Error("Unexpected error ");
              }
              console.log("data",data);
          return data;
        })
      }

      static async getComments(post_id, page_no,page_size) {
        let url ="http://localhost:5000/fetch/comments";
        url += "?post_id=" + post_id +"&page_size=" + page_size + "&page_no=" + page_no;
        return await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' ,
             'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
        }).then(async response => {
          console.log(response);
          const data = await response.json(); 
  
          if (!response.ok && data && data.error) { 
                  console.error('Error message:', data.error);
                  throw new Error(data.error);
              } else if(!response.ok) {
                  console.error('Unexpected response format:', data);
                  throw new Error("Unexpected error ");
              }
              console.log("data",data);
          return data;
        })
      }

      static async getLikes(post_id, page_no,page_size) {
        let url ="http://localhost:5000/fetch/liked";
        url += "?post_id=" + post_id +"&page_size=" + page_size + "&page_no=" + page_no;
        return await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' ,
             'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
        }).then(async response => {
          console.log(response);
          const data = await response.json(); 
  
          if (!response.ok && data && data.error) { 
                  console.error('Error message:', data.error);
                  throw new Error(data.error);
              } else if(!response.ok) {
                  console.error('Unexpected response format:', data);
                  throw new Error("Unexpected error ");
              }
              console.log("data",data);
          return data;
        })
      }

      static async addComments(post_id, comment_text) {
        let url ="http://localhost:5000/comment";
        return await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' ,
             'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({ post_id,comment_text }),
        }).then(async response => {
          console.log(response);
          const data = await response.json(); 
  
          if (!response.ok && data && data.error) { 
                  console.error('Error message:', data.error);
                  throw new Error(data.error);
              } else if(!response.ok) {
                  console.error('Unexpected response format:', data);
                  throw new Error("Unexpected error ");
              }
              console.log("data",data);
          return data;
        })
      }
      static async likeUnlike(post_id) {
        let url ="http://localhost:5000/like";
        return await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' ,
             'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({ post_id }),
        }).then(async response => {
          console.log(response);
          const data = await response.json(); 
  
          if (!response.ok && data && data.error) { 
                  console.error('Error message:', data.error);
                  throw new Error(data.error);
              } else if(!response.ok) {
                  console.error('Unexpected response format:', data);
                  throw new Error("Unexpected error ");
              }
              console.log("data",data);
          return data;
        })
      }

      static async addPost(formData) {
        console.log("form",formData)
        let url ="http://localhost:5000/post";
        return await fetch(url, {
          method: 'POST',
          headers: { 
             'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: formData
        }).then(async response => {
        console.log(response);
        console.log("form",formData)

        const data = await response.json(); 
  
        if (!response.ok && data && data.error) { 
            console.error('Error message:', data.error);
            throw new Error(data.error);
        } else if(!response.ok) {
            console.error('Unexpected response format:', data);
            throw new Error("Unexpected error ");
        }
        console.log("data",data);
        return data;
        })
      }
    
} 
export default PostService;
  