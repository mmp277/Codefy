import axios from "axios"
import { useEffect, useState, useRef, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import './auth.css';

const AccVerify = () => {
    const navigate = useNavigate()
    const params = useParams()
    const userid = params.id
    const hasFetchedRef = useRef(false);
    const [otp, setOtp] = useState('')

    const handleGetOTP = useCallback(async () => {
    try {
        const AccessToken = localStorage.getItem('AccessToken');
        const response = await axios.get(`http://localhost:3001/LogIn/${userid}/Profile/AccVerify`, {
            headers: {
                'authorization': `Bearer ${AccessToken}`
            },
            withCredentials: true
        });
        const data = await response.data;
        if (data.error) {
            throw new Error(data.message);
        }
        alert("The OTP has been sent to your Registered Email ID. It is valid for 15 minutes. Do not make any OTP Request for the next 15 minutes.");
    } catch (error) {
        alert("Some error occurred\n" + error.message);
    }
}, [userid]);

useEffect(() => {
    if (!hasFetchedRef.current) {
        handleGetOTP();
        hasFetchedRef.current = true;
    }
}, [handleGetOTP]);


    const handlePostOTP = async () => {
        if (otp.trim() === "") {
            alert("Enter OTP first")
            return;
        }
        try {
            const AccessToken = localStorage.getItem('AccessToken')
            localStorage.setItem('AccessToken', AccessToken)
            const response = await axios.post(`http://localhost:3001/LogIn/${userid}/Profile/AccVerify`, { otp }, {
                headers: {
                    'authorization': `Bearer ${AccessToken}`
                }
            }, { withCredentials: true })
            const data = await response.data
            if (data.error) {
                throw new Error(data.message)
            }
            alert('Email Verification Successfully')
            navigate(-1)
        } catch (error) {
            alert("Error Occured\n", error.message)
        }
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="login-form-wrapper" style={{}}>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    handlePostOTP()
                }} style={{ display: 'flex', flexDirection: 'column' }}>
                    <input type="text" placeholder="Enter your 4-Digit OTP" onChange={(e) => { setOtp(e.target.value) }} />
                    <input type="submit" value="Submit OTP" />
                </form>
            </div>
        </div>
    )
}

export default AccVerify