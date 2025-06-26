import { useNavigate } from "react-router-dom";
import {  useEffect, useRef, useState } from "react";
import Navbar1 from "../../components/Navbar1";
import axios from "axios";
import './auth.css';

const ResetPassword = () => {
    const [username, setUsername] = useState('');
    const [otp, setOtp] = useState('');
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [errorCase , setErrorCase] = useState('')
    const hasFetchedRef = useRef(false)
    const navigate = useNavigate()

    const handleSubmit = async () => {
        try{
            if(otp.length !== 4){
                setErrorCase('OTP must have 4 digits')
                return;
            }
            if(pass !== confirmPass){
                setErrorCase('Password must match with Confirm password')
                return;
            }
            const response = await axios.post(`http://localhost:3001/ForgotPassword/ResetPassword` , {username , otp , newPassword:pass} , {withCredentials:true})
            const data = await response.data
            if(data.error){
                throw new Error(data.message)
            }
            alert(data.message)
            navigate(-2)
        }catch(error){
            alert(`Request Declined!! ${error.message}`)
            navigate(-2)
        }
    }

    useEffect(()=>{
        if(!hasFetchedRef.current){
        hasFetchedRef.current = true
        alert('A 4-digit OTP has been sent to your registered email address. It is valid for 15minutes. Prevent making any OTP request for the next 15minutes')
        }
    } , [])

    return (
        <>
                <Navbar1 />
            <div className="body-wrapper">
                <div className="login-form-wrapper">
                    <form action="/ForgotPassword" method="post" onSubmit={(e)=>{
                        e.preventDefault()
                        handleSubmit()
                    }}>
                        <h2>Reset Password</h2>
                        <input type="text" placeholder="Enter your username" onChange={e => setUsername(e.target.value)} required/>
                        <input type="text" placeholder="Enter 4-digit OTP" onChange={e => setOtp(e.target.value)} required/>
                        <input type="password" placeholder="Enter your new password" onChange={e => setPass(e.target.value)} required/>
                        <input type="password" placeholder="Confirm password" onChange={e => setConfirmPass(e.target.value)} required/>
                        <input type="submit" value='Reset Password' />
                    </form>
                    <div>{errorCase}</div>
                </div>
            </div>
        </>
    );
}

export default ResetPassword;
