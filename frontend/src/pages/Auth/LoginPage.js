
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import Navbar1 from "../../components/Navbar1.js";
import './auth.css';

function LogIn(){
    const [username , setUsername]=useState();
    const [password , setPassword]=useState();
    const [errorCase , setErrorCase] = useState();
    const navigate = useNavigate()

    const handleLogin=async ()=>{
      try{
        const response=await axios.post('http://localhost:3001/LogIn',
          {username , password} )
        const data =  await response.data
        if(!data.error){
            const loggedInUser =data.loggedInUser
            const AccessToken = data.AccessToken
            localStorage.setItem('AccessToken' , AccessToken)
            navigate(`/LogIn/${loggedInUser._id}`)
        }else{
          setErrorCase('Invalid Login Credentials')
        }
      }catch(error){
        console.log(error)
        setErrorCase("Error in Logging In User!", error.message)
      }
    }

    return(<>
    <Navbar1/>
    <div className='body-wrapper'>
    
  
    <div className='login-form-wrapper'>
  
    <form method='post' action='/LogIn' onSubmit={async (e)=>{
      e.preventDefault();
      handleLogin()
    }}>
      <h2>LogIn</h2>
      <input type='text' name='uniqueUser' placeholder='Enter your username' onChange={(e)=>setUsername(e.target.value)} required/>
      <input type='password' name='password' placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)} required/>
      <input className='login-submit' type='submit' value="LogIn"/>
    </form>
      <div className="error-wrapper">{errorCase}</div>
      <div className='login-extras-wrapper'>
      <p><Link to='/ForgotPassword'>Forgot Password?</Link></p>
      <p><Link to='/SignUp'>Don't have an Account?</Link></p>
      </div>
  
    </div>
  
    </div>

    </>
    )
}
export default LogIn