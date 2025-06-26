import axios from "axios";
import Navbar2 from "../../components/Navbar2";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './dashboard.css';

const AccEdit = ()=>{

    
    const [techStack , setTechStack]=useState("");
    const [language , setLanguage]=useState("");
    const [codeforces , setCodeforces]=useState("");
    const [codechef ,  setCodechef]=useState("");
    const [leetcode ,  setLeetcode]=useState("");
    const [password , setPassword]=useState("");
    const [errorCase , setErrorCase]=useState('')

    const params = useParams()
    const navigate  = useNavigate()
    const userId = params.id

    useEffect(()=>{
        console.log(password)
    }, [password])

    const handlePutAccEdit = async()=>{
        try{
            const AccessToken = localStorage.getItem('AccessToken')
            localStorage.setItem('AccessToken' , AccessToken)
            const response = await axios.put(`http://localhost:3001/LogIn/${userId}/Profile/AccEdit` , 
                {techStack , language , codechef , codeforces , leetcode , password} ,{
                    headers:{
                        'authorization':`Bearer ${AccessToken}`
                    }
                }  , {withCredentials:true})
            const data = await response.data
            if(data.error){
                throw new Error(data.message)
            }
            alert(data.message)
            navigate(-1)
        }catch(error){
            setErrorCase(error.message)
        }
    }

    return(<>
       
        <Navbar2/>
        <div className="body-wrapper">
        <div className="signup-form-wrapper">
            
        <form onSubmit={(e)=>{
            e.preventDefault();
            handlePutAccEdit()
        }}>
        <h4>Enter your current password for validation</h4>
        <input type="password" onChange={(e)=>{setPassword(e.target.value)}}/>
        <h4>Put the data you want to edit</h4>
        <input type='text' name='techStack' placeholder='Enter your new TeckStack' onChange={(e)=>setTechStack(e.target.value)} />
        <input type='text' name='language' placeholder='Enter your new  Preferred Language' onChange={(e)=>setLanguage(e.target.value)} />
        <input type='text' name='codeforces' placeholder='Enter your new Rating in Codeforces' onChange={(e)=>setCodeforces(e.target.value)} />
        <input type='text' name='codechef' placeholder='Enter your new Rating in CodeChef' onChange={(e)=>setCodechef(e.target.value)} />
        <input type='text' name='leetcode' placeholder='Enter your new Rating in LeetCode' onChange={(e)=>setLeetcode(e.target.value)} />
        <input className='login-submit' type="submit" value='Save The Chanhges'/>
        </form>
        <div className="error-wrapper">{errorCase}</div>
        </div>
        </div>
        </>)
    }
    export default AccEdit 
    