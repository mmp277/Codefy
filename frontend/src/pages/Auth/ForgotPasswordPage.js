import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar1 from "../../components/Navbar1.js";
import axios from "axios";
import './auth.css';

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const [errorCase , setErrorCase] = useState('')
    const navigate = useNavigate()

    const handlePostOTP = async() => {
       try{
        const response  =await axios.post(`http://localhost:3001/ForgotPassword` , {username} , {withCredentials:true})
        const data = await response.data
        if(data.error){
            throw new Error(data.message)
        }
        navigate('ResetPassword')
       }catch(error){
        setErrorCase(`Error Occured. ${error.message}`)
       }
    }

    return (
        <>
                <Navbar1 />
            <div className="body-wrapper">
                <div className="login-form-wrapper"> 
                    <form action="/ForgotPassword" method="post" onSubmit={async (e) => {
                        e.preventDefault();
                        handlePostOTP();
                    }}>
                        <h2>Forgot Password</h2>
                        <input type="text" placeholder="Enter your username" onChange={e => setUsername(e.target.value)} required/>
                        <input type="submit" value='Get OTP' />
                    </form>
                    <div>{errorCase}</div>
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;
