import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useRef, useCallback } from "react";
import './auth.css';
const Logout = () => {

    const navigate = useNavigate()
    const params = useParams()
    const userid = params.id
    const isFetchRef = useRef(false)

    const handleLogOut = useCallback(async () => {
        try {
            const AccessToken = localStorage.getItem('AccessToken');
            const response = await axios.get(`http://localhost:3001/LogIn/${userid}/LogOut`, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${AccessToken}`
                },
                withCredentials: true
            });

            const data = response.data;
            if (data.error) {
                throw new Error(data.message);
            }

            localStorage.removeItem('AccessToken'); // ✅ clear token after logout
        } catch (error) {
            navigate(-1); // go back on error
            alert(`Error in Logging Out. ${error.message}`);
        }
    }, [userid, navigate]);

    useEffect(() => {
        if (!isFetchRef.current) {
            isFetchRef.current = true;
            handleLogOut();
        }
    }, [handleLogOut]);

    return (
        <div className="flex2" style={{ height: '100vh',paddingTop:'5vh',alignItems:'center'}}>
            <FontAwesomeIcon icon={faCircleCheck} style={{fontSize:'10vh'}}></FontAwesomeIcon>
            <h1>Logged out!</h1>
            <button className="link-button">
  <Link to="/" style={{ color: 'inherit', padding:'10px',paddingBottom:'10px',textDecoration:'none' }}>Return to Home</Link>
</button>
        </div>
    );
}

export default Logout;