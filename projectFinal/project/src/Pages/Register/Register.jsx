import "./Register.css"
import UserService from '../../Services/UserService';
import { ClipLoader } from 'react-spinners';
import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuestion,setShowQuestion] = useState(false);
  const [validatedAnswer,setValidatedAnswer] = useState(false);
  const [image,setImage]  = useState(null);
  const [type,setType] = useState("signup");
  const [cp,setCp] = useState(false);


  const handleClick = async (event) => {
    event.preventDefault()
    if (!validateForm()) {
      setUserName('')
      setPassword('')
      return; 
    }
    setIsLoading(true);
    event.preventDefault();
    
    const hashedPassword = password;
    try {
      const response = await UserService.register(userName, name, hashedPassword,email,question,answer);
      const token = response.token;
      localStorage.setItem('authToken', token);
      const imageres = await UserService.upload_image(image);
      setIsLoading(false);
      setLoginErrorMessage('')
      navigate('/profile');
    } catch (error) {
      setIsLoading(false)
      setErrorMessage(error.message || 'Something went wrong!');
    }
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
  const handleClickLogin = async (event) => {
    event.preventDefault()
    if (!validateForm()) {
      setUserName('')
      setPassword('')
      return; 
    }
    console.log(event);
    setIsLoading(true);
    event.preventDefault();
    const hashedPassword = password;
    console.log(userName,hashedPassword,validatedAnswer)
    if(showQuestion){
      try {
      setAnswer('')
      const response = await UserService.validateAnswer(userName,hashedPassword);
      setValidatedAnswer(true);
      setLoginErrorMessage('')
      setPassword('');
      setShowQuestion(false);
      setIsLoading(false)

      }catch(error){
        setIsLoading(false)
        console.log("err",error)
        setLoginErrorMessage(error.message || 'Something went wrong!');
      }
    }else{
    try {
      const response = await UserService.login(userName, hashedPassword, validatedAnswer?"password":"login");
      const token = response.token;

      localStorage.setItem('authToken', token);
      setIsLoading(false);
      navigate('/profile');
    } catch (error) {
      setIsLoading(false)
      console.log("err",error)
      setLoginErrorMessage(error.message || 'Something went wrong!');
    }
  }
  };
  const [userName, setUserName] = useState('');

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };
  const [name, setName] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const [password, setPassword] = useState('');

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const [question, setQuestion] = useState('');

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };
  const [answer, setAnswer] = useState('');

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    if (!userName) {
      newErrors.userName = 'Username is required';
    }

    if (showQuestion) {
      if (!question) {
        newErrors.question = 'Question is required';
      }
    } else {
      if (!password) {
        newErrors.password = 'Password is required';
      }
    }

    if(type=="signup"){
      if (!name) {
        newErrors.name = 'Name is required';
      }
      if (!email) {
        newErrors.email = 'Email is required';
      }
      if (!question) {
       newErrors.question = 'Question is required';
      }
      if (!answer) {
        newErrors.answer = 'answer is required';
      }
      if (!image) {
        newErrors.image = 'Profile pic is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  const forgotPassword = async (event)=>{
    event.preventDefault();
    try {
      const response = await UserService.getQuestion(userName);
      console.log("get que",response);
      setQuestion(response);
      setShowQuestion(true);
      setErrorMessage(null);
      setLoginErrorMessage(null);
      setPassword(null);
      setCp(true);
      console.log("reset",password);
    } catch (error) {
      console.log("err",error)
      setLoginErrorMessage(error.message || 'Something went wrong!');
    }
  }

  const toggle = (type)=>{
    setUserName(null);
    setQuestion(null);
    setPassword(null);
    setShowQuestion(false);
    setType(type)
  }
  return (
   

    <div className="App">
     <div className="main">  	
		<input type="checkbox" id="chk" aria-hidden="true" />

			<div className="signup">
				<form>
					<label htmlFor="chk" aria-hidden="true" onClick={()=>toggle("signup")}>Sign up</label>
         <div className="tettt"> UserName:
					<input type="text" name="txt" placeholder="User name" required="" value={userName} onChange={handleUserNameChange}/> {errors.userName && <span className="error">{errors.userName}</span>}</div>
					<div className="tettt"> Name:<input type="text" name="name" placeholder="Name" required="" value={name} onChange={handleNameChange}/> {errors.name && <span className="error">{errors.name}</span>}</div>
					<div className="tettt"> Password:<input type="password" name="pswd" placeholder="Password" required value={password} onChange={handlePasswordChange} /> {errors.password && <span className="error">{errors.password}</span>}</div>
          <div className="tettt"> Email:<input type="email" name="email" placeholder="Email Id" required="" value={email} onChange={handleEmailChange} /> {errors.email && <span className="error">{errors.email}</span>}</div>
          <div className="tettt"> Question:<input type="text" name="question" placeholder="Question" required="" value={question} onChange={handleQuestionChange} /> {errors.question && <span className="error">{errors.question}</span>}</div>
          <div className="tettt"> Answer:<input type="text" name="answer" placeholder="Answer" required="" value={answer} onChange={handleAnswerChange} /> {errors.answer && <span className="error">{errors.answer}</span>}</div>
          <div className="tettt"> Image:<input type="file" accept="image/*" name= "image" style={{color:"black"}} onChange={handleImageChange}/>{errors.image && <span className="error">{errors.image}</span>}</div>
          <div className="qa">Question, Answer will be used in case you forgot password</div>
					{!isLoading && <button onClick={handleClick}>Sign up</button>}
          {isLoading && (
        <ClipLoader color={'#fff'} size={20} loading={isLoading}  className="spinner-center"/>
          )}
          {errorMessage?.length>0 && <p className="error-message">{errorMessage}</p>}
				</form>
			</div>

			<div className="login" >
				<form>
					<label htmlFor="chk" aria-hidden="true" onClick={()=>toggle("login")}>Login</label>
					{!showQuestion && <div className="tettt" style={{color:"black"}}> UserName:<input type="text" name="txt" placeholder="User name" value={userName} onChange={handleUserNameChange} required />{errors.userName && <span className="error">{errors.userName}</span>}</div>}
          {showQuestion && <div className="tettt" style={{color:"black"}}> Question:<input type="text" name="question" placeholder="Question" required="" value={question} onChange={handleQuestionChange} /></div>}
					<div className="tettt" style={{color:"black"}}> {showQuestion?"answer":cp==true ? "New Password":"Password"}:<input type="password" name="pswd" placeholder={showQuestion?"answer":"Password"} value={password} onChange={handlePasswordChange} required /> {errors.password && <span className="error">{errors.password}</span>}</div>
					{!isLoading && <button onClick={handleClickLogin}>{showQuestion?"Submit" :cp==true ? "Change Password and Login":"Login"}</button>}
          {isLoading && (
          <ClipLoader color={'#fff'} size={20} loading={isLoading}  className="spinner-center"/>
          )}
          <div onClick={forgotPassword} style={{color:"black",cursor:"pointer"}}>Forgot Password<p>(Enter your username before clicking forgot password to reset your password)</p></div>
          {validatedAnswer && <p>You can enter new password</p>}
          {loginErrorMessage && <p className="error-message">{loginErrorMessage}</p>}
				</form>
			</div>
	</div>
    </div>
  )
}
