import Navbar2 from "../../components/Navbar2.js";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faThumbsUp, faCopy } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./qa.css";

const Question = () => {
  const navigate = useNavigate();
  const params = useParams();
  const userid = params.id;
  const qid = params.qid;
  const isFetchRef = useRef(false);

  const [question, setQuestion] = useState({
    headline: "Loading...",
    name: "Loading...",
    statement: "Loading...",
    code: "Loading...",
    upvote: 0,
  });
  const [isUpVoted, setIsUpVoted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetQuestion = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const AccessToken = localStorage.getItem("AccessToken");
      if (!AccessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.get(
        `http://localhost:3001/LogIn/${userid}/${qid}`,
        {
          headers: {
            'Authorization': `Bearer ${AccessToken}`,
          },
          withCredentials: true,
        }
      );

      const data = response.data;
      if (data.error) {
        throw new Error(data.message);
      }

      setQuestion(data.data);
      setIsBookmarked(data.isBookmarked || false);
      setIsUpVoted(data.isUpVoted || false);
    } catch (error) {
      console.error("Error fetching question:", error);
      setError(error.response?.data?.message || error.message || "Failed to load question");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isFetchRef.current) {
      isFetchRef.current = true;
      handleGetQuestion();
    }
  }, [userid, qid]);

  const handlePostBookmark = async () => {
    try {
      const AccessToken = localStorage.getItem("AccessToken");
      if (!AccessToken) {
        throw new Error("No access token found");
      }

      const newBookmarkState = !isBookmarked;
      setIsBookmarked(newBookmarkState);

      const response = await axios.post(
        `http://localhost:3001/LogIn/${userid}/${qid}/Bookmark`,
        {},
        {
          headers: { 
            'Authorization': `Bearer ${AccessToken}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true,
        }
      );

      const data = response.data;
      if (data.error) {
        setIsBookmarked(!newBookmarkState);
        throw new Error(data.message);
      }

      if (data.isBookmarked !== undefined) {
        setIsBookmarked(data.isBookmarked);
      }
    } catch (error) {
      console.error("Error bookmarking:", error);
      setError(error.response?.data?.message || error.message || "Failed to bookmark");
    }
  };

  const handlePostUpVote =async()=>{
        try{
            const AccessToken = localStorage.getItem('AccessToken')
            localStorage.setItem('AccessToken' , AccessToken)
            const response = await axios.post(`http://localhost:3001/LogIn/${userid}/${qid}/Question-UpVote`,{},{
                headers:{
                    'authorization':`Bearer ${AccessToken}`
                }
            } , {withCredentials:true})
            const data = await response.data
            if(data.error){
                throw new Error(data.message)
            }
            handleGetQuestion()
        }catch(error){
            alert('Error in UpVoting the question' , error.message)
        }
    }

  return (
    <> 
      <Navbar2 />
      <div className='body-wrapper' style={{ 
        background: '#121212',
        minHeight: '100vh',
        padding: '20px 0',
        color: '#e0e0e0'
      }}>
        {error && (
          <div style={{
            width: '90%',
            margin: '0 auto 20px',
            padding: '15px',
            backgroundColor: '#ff4444',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        

        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between', 
          width: '90%',
          padding: '15px',
          margin: '0 auto 20px',
          backgroundColor: '#1e1e1e',
          borderRadius: '8px',
          border: '1px solid #333'
        }}>
          <p style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            margin: 0,
            color: '#bb86fc'
          }}>{question.name}</p>
        </div>

        <div style={{ 
          width: '90%',
          margin: '0 auto',
          padding: '25px',
          backgroundColor: '#1e1e1e',
          borderRadius: '8px',
          border: '1px solid #333',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          <h1 style={{ 
            fontSize: '2rem',
            fontWeight: '700',
            color: '#bb86fc',
            margin: '0 0 15px 0'
          }}>{question.headline}</h1>
          
          <div style={{
            padding: '15px',
            backgroundColor: '#252525',
            borderRadius: '8px',
            marginBottom: '20px',
            borderLeft: '4px solid #bb86fc'
          }}>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6',
              color: '#e0e0e0',
              margin: 0
            }}>{question.statement}</p>
          </div>
          
          <div style={{
            position: 'relative',
            width: '100%', 
            borderRadius: '8px',
            marginBottom: '20px',
            backgroundColor: '#121212',
            border: '1px solid #333'
          }}>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(question.code);
              }}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: '#333',
                color: '#e0e0e0',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <FontAwesomeIcon icon={faCopy} style={{ fontSize: '0.8rem' }} />
              <span>Copy</span>
            </button>
            <pre style={{
              padding: '20px',
              margin: 0,
              color: '#d4d4d4',
              overflowX: 'auto',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              fontSize: '0.95rem',
              lineHeight: '1.5'
            }}>{question.code}</pre>
          </div>
        </div>

        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between', 
          width: '90%',
          padding: '15px',
          margin: '20px auto 0',
          backgroundColor: '#1e1e1e',
          borderRadius: '8px',
          border: '1px solid #333',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button 
              onClick={handlePostBookmark}
              disabled={isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: isBookmarked ? '#bb86fc' : '#9e9e9e',
                fontWeight: isBookmarked ? '600' : '400',
                fontSize: '1rem',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              <FontAwesomeIcon 
                icon={faBookmark} 
                style={{ 
                  fontSize: '1.2rem',
                  color: isBookmarked ? '#bb86fc' : '#9e9e9e'
                }} 
              />
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
            
            <button 
              onClick={handlePostUpVote}
              disabled={isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: isUpVoted ? '#bb86fc' : '#9e9e9e',
                fontWeight: isUpVoted ? '600' : '400',
                fontSize: '1rem',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              <FontAwesomeIcon 
                icon={faThumbsUp} 
                style={{ 
                  fontSize: '1.2rem',
                  color: isUpVoted ? '#bb86fc' : '#9e9e9e'
                }} 
              />
              <span>{question.upvote}</span>
            </button>
          </div>
          
          <button 
            style={{
              background: '#bb86fc',
              color: '#121212',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '20px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'background 0.2s',
              opacity: isLoading ? 0.7 : 1
            }}
            onMouseOver={(e) => !isLoading && (e.currentTarget.style.background = '#9b66f2')}
            onMouseOut={(e) => !isLoading && (e.currentTarget.style.background = '#bb86fc')}
            onClick={() => { navigate(`Comments`) }}
            disabled={isLoading}
          >
            See Comments
          </button>
        </div>
      </div>
    </>
  );
}

export default Question;