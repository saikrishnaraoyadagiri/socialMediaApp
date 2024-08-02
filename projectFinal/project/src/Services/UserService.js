class UserService {
    static async register(user_name,name, password,email,question,answer) {
      return await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name,name,  password,email,question,answer }),
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
            console.log(data);
        return data;
      })
    }


    static async login(user_name, password,action) {
      let url = "http://localhost:5000/"+action;
      url += "?user_name=" +user_name + "&password=" +password;
      return await fetch(url, {
        method: 'GET',
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
            console.log(data);
        return data;
      })
    }

    static async getQuestion(user_name) {
      let url = "http://localhost:5000/question";
      url += "?user_name=" +user_name;
      return await fetch(url, {
        method: 'GET',
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
            console.log(data);
        return data;
      })
    }

   

    static async validateAnswer(user_name,answer) {
      let url = "http://localhost:5000/answer";
      url += "?user_name=" +user_name +"&answer="+answer;
      return await fetch(url, {
        method: 'GET',
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
            console.log(data);
        return data;
      })
    }
    
  
  

    static async getUserProfile(user_id){
      console.log("user",user_id);
    console.log("else");

      let url = "http://localhost:5000/user";
      url +=  user_id != null && user_id!='0' ? '/'+user_id:'';
      return await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      }).then(async response => {
        console.log(response);
        const data = await response.json(); 
        console.log("got user data",data);
        if (!response.ok && data && data.error) { 
                console.error('Error message:', data.error);
                throw new Error(data.error);
            } else if(!response.ok) {
                console.error('Unexpected response format:', data);
                throw new Error("Unexpected error ");
            }else if(!user_id && user_id!='0')
              sessionStorage.setItem('userData',JSON.stringify(data));
            console.log(data);
        return data;
      })
    }

    static async update_profile(name,bio, gender,email,dob) {

      return await fetch('http://localhost:5000/update', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization':  `Bearer ${localStorage.getItem('authToken')}` 
        },
        body: JSON.stringify({ name,bio,gender,email,dob}),
      }).then(async response => {
        console.log(response);
        const data = await response.json(); 
        sessionStorage.removeItem('userData');
        if (!response.ok && data && data.error) { 
                console.error('Error message:', data.error);
                throw new Error(data.error);
            } else if(!response.ok) {
                console.error('Unexpected response format:', data);
                throw new Error("Unexpected error ");
            }
            console.log(data);
        return data;
      })
    }

  

    static async upload_image(image) {
      if(!image){
        return;
      }
      const formData = new FormData();
      formData.append('file', image);
      return await fetch('http://localhost:5000/upload_image', {
        method: 'POST',
        headers: { 
          'Authorization':  `Bearer ${localStorage.getItem('authToken')}` 
        },
        body:formData,
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
            console.log(data);
        return data;
      })
    }
  

    
}

  
  export default UserService;
  