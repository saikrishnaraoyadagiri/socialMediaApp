class SocialService {
    
  static async fetchRequests(action,page_size,page_no) {
    let url ="http://localhost:5000/"+action;
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

  static async searchUsers(search,page_size,page_no) {
    let url ="http://localhost:5000/search";
    url += "?page_size=" + page_size + "&page_no=" + page_no +"&search_text="+ search ;
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
  static async action(action,follower_id) {
    let url ="http://localhost:5000/"+action;
    return await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' ,
         'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ follower_id})
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

  static async followUnFollow(action,followed_id) {
    let url ="http://localhost:5000/"+action;
    return await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' ,
         'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ followed_id})
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


}
export default SocialService;
  