import { faBookmark, } from "@fortawesome/free-solid-svg-icons"
import Navbar2 from "../../components/Navbar2"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect,  useRef,  useState } from "react"
import axios from 'axios'
import { useNavigate , useParams } from "react-router-dom"
import './dashboard.css';

function DashBoard() {
    const [feed , setFeed] = useState([]);
    const navigate=useNavigate()
    const params = useParams()
    const isFetchRef = useRef(false)
    const userId = params.id
    
    const handlePostBookmark = async(qid)=>{
        try{
            const AccessToken = localStorage.getItem('AccessToken')
            localStorage.setItem('AccessToken' , AccessToken)
            const response = await axios.post(`http://localhost:3001/LogIn/${userId}/${qid}/Bookmark` ,{
                headers:{
                    'Content-Type':'application/json',
                    'authorization':`Bearer ${AccessToken}`
                }
            }  , {withCredentials:true})
            const data = await response.data
            if(data.error){
                throw new Error(data.message)
            }
        }catch(error){
            alert("Error in Bookmarking the question." , error.message);
        }
    }
    
    
    const handleDashboard = async()=>{
        try{ 
            const AccessToken = localStorage.getItem('AccessToken')
            localStorage.setItem('AccessToken' , AccessToken)
            const response = await axios.get(`http://localhost:3001/LogIn/${userId}` ,{
                headers:{
                    'authorization':`Bearer ${AccessToken}`
                }
            } ,{withCredentials:true})
            const data= await response.data
            if(!data.error){
                setFeed(data.data)
            }else{
                alert('Failed to load the questions')
            }
        }catch(error){
            alert(`Some Error Occured. ${error.message}`)
        }
    }
    useEffect(()=>{
        if(!isFetchRef.current){
            isFetchRef.current=true
            handleDashboard()
        }
    },)
    
    return (<>
        <Navbar2 />
        <div className="d-wrapper">
        
        <div className="ques-wrapper" style={{display:"flex" , flexDirection:'column'}}>
        {
            feed.map(item =>{
                return(
                    <div className="flex ques" style={{margin:'10px 0px' ,justifyContent: 'space-between' , cursor:'pointer' }} onClick={()=>{navigate(`/LogIn/${userId}/${item._id}`)}}>
                    <p className="ques-tag" style={{cursor:'pointer'}}>Open</p>
                    <p style={{cursor:'pointer'}}>{item.headline}</p>
                    <FontAwesomeIcon icon={faBookmark} style={{ zIndex:'2' ,color: '#90FF69', fontSize: '4vh' }} onClick={()=>{handlePostBookmark(item._id)}}/>
                    </div>
                )
                
            })
        }
        
        
        {/* /this below is just demo */}
        {/* <div className="flex ques" style={{ justifyContent: 'space-between' }} onClick={()=>{navigate(`/LogIn/4567/1234`)}}>
            <p className="ques-tag">Ques</p>
            <p>knsdkewcv pwoivn 3r nepi fdvijwdfvpoidj kn opwiejfdipevo opwejfn jvir jfiowefhweoibjdv uiowehfoweu</p>
            </div> */}
            </div>
            </div>
            </>)
        }
        
        export default DashBoard