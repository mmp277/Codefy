import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faCommentDots, faPaperPlane, faTrash, faCopy } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Editor } from "@monaco-editor/react";
import Navbar2 from "../../components/Navbar2";
import './qa.css';

const Comments = () => {
    const [comment, setComment] = useState("");
    const [code, setCode] = useState('');
    const [comments, setComments] = useState([]);
    const [headline, setHeadline] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const hasFetchRef = useRef(false);
    const { id: userId, qid: questionId } = useParams();
    const navigate = useNavigate();
    const apiService = async (method, endpoint, data = null) => {
    const AccessToken = localStorage.getItem('AccessToken');
    console.log(`Making ${method} request to ${endpoint}`); // Debug log
    console.log('AccessToken present:', !!AccessToken); // Debug log

    if (!AccessToken) {
        handleUnauthorized();
        throw new Error("No access token");
    }

    const config = {
        method,
        url: `http://localhost:3001${endpoint}`,
        headers: {
            'Authorization': `Bearer ${AccessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        withCredentials: true,
        timeout: 10000,
        data
    };

    try {
        const response = await axios(config);
        console.log('API Response:', response);
        return response.data;
    } catch (error) {
        console.error('Full API Error:', error); 
        console.error('Error Response:', error.response); 
        
        const apiError = new Error(error.response?.data?.message || "Server Error Occurred");
        apiError.status = error.response?.status;
        apiError.data = error.response?.data;
        throw apiError;
    }
};

    useEffect(() => {
        console.log('Comments state updated:', comments);
    }, [comments]);

    useEffect(() => {
        console.log('Loading state changed:', isLoading);
    }, [isLoading]);

    useEffect(() => {
        console.log('Current error state:', error);
    }, [error]);

    
    const handleUnauthorized = () => {
        localStorage.removeItem('AccessToken');
        navigate('/login', { state: { from: 'comments' }, replace: true });
    };
    
    
    const fetchData = async () => {
    setIsLoading(true);
    try {
        const data = await apiService(
            'GET',
            `/LogIn/${userId}/${questionId}/Comment`
        );

        const responseData = data.data || data;
        
        if (!responseData || !responseData.comments) {
            throw new Error("Invalid response format");
        }

        setComments(responseData.comments);
        setHeadline(responseData.headline || "Question Comments");

    } catch (error) {
        setError(error.message);
    } finally {
        setIsLoading(false);
    }
};
    useEffect(() => {
  let isMounted = true;
  
  const loadData = async () => {
    try {
      await fetchData();
    } catch (err) {
      if (isMounted) {
        console.error("Component error:", err);
        setError(err.message);
      }
    }
  };

  loadData();

  return () => {
    isMounted = false;
    setError(null); 
  };
}, [userId, questionId]);

    const handleUpVote = async (cid) => {
        try {
            const AccessToken = localStorage.getItem('AccessToken');
            if (!AccessToken) {
                handleUnauthorized();
                return;
            }

            setComments(prev => prev.map(c => 
                c._id === cid ? { ...c, upvote: (c.upvote || 0) + 1, userUpvoted: true } : c
            ));

            const response = await axios.post(
                `http://localhost:3001/LogIn/${userId}/${questionId}/Comment/${cid}/Comment-UpVote`,
                {},
                {
                    headers: { 'Authorization': `Bearer ${AccessToken}` },
                    withCredentials: true,
                    timeout: 5000
                }
            );

            if (response.data?.error) {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error("Upvote error:", error);
            fetchData();
            
            if (error.response?.status === 401) {
                handleUnauthorized();
            } else {
                setError(error.response?.data?.message || "Failed to upvote comment");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!comment.trim()) {
            setError("Comment cannot be empty");
            return;
        }

        try {
            setIsLoading(true);
            
            await apiService(
                'POST',
                `/LogIn/${userId}/${questionId}/Post-Comment`,
                { text: comment, code: code || '' }
            );

            setComment("");
            setCode("");
            setError(null);
            await fetchData();
            
        } catch (error) {
            console.error("Submission error:", error);
            setError(error.message || "Failed to post comment");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelComment = async (cid) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) {
            return;
        }

        try {
            setComments(prev => prev.filter(c => c._id !== cid));
            
            const AccessToken = localStorage.getItem('AccessToken');
            if (!AccessToken) {
                handleUnauthorized();
                return;
            }

            await axios.delete(
                `http://localhost:3001/LogIn/${userId}/${questionId}/Del-Comment/${cid}`,
                {
                    headers: { 'Authorization': `Bearer ${AccessToken}` },
                    withCredentials: true,
                    timeout: 5000
                }
            );
        } catch (error) {
            console.error("Delete error:", error);
            fetchData();
            
            if (error.response?.status === 401) {
                handleUnauthorized();
            } else {
                setError(
                    error.response?.data?.message || 
                    "Failed to delete comment. Please try again."
                );
            }
        }
    };

    const copyCode = (code, id) => {
        navigator.clipboard.writeText(code).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }).catch(err => {
            console.error("Copy failed:", err);
            setError("Failed to copy code to clipboard");
        });
    };

    return (
        <>
            <Navbar2 />
            <div className="comments-container" style={{
                background: '#121212',
                minHeight: '100vh',
                padding: '20px',
                color: '#e0e0e0'
            }}>
                
                {error && (
                    <div style={{
                        background: '#ff4444',
                        color: 'white',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span>{error}</span>
                        <button 
                            onClick={() => setError(null)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '1.2rem'
                            }}
                        >
                            &times;
                        </button>
                    </div>
                )}

                
                <div style={{
                    background: '#1e1e1e',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid #333'
                }}>
                    <h1 style={{
                        fontSize: '1.8rem',
                        fontWeight: '600',
                        color: '#bb86fc',
                        margin: 0
                    }}>
                        {isLoading ? "Loading..." : headline}
                    </h1>
                </div>

                
                <div style={{
                    maxHeight: '60vh',
                    overflowY: 'auto',
                    marginBottom: '20px',
                    paddingRight: '10px'
                }}>
                    {isLoading ? (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '40px',
                            color: '#9e9e9e'
                        }}>
                            Loading comments...
                        </div>
                    ) : comments.length === 0 ? (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '40px',
                            color: '#9e9e9e'
                        }}>
                            No comments yet. Be the first to comment!
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment._id} style={{
                                background: comment.userid === userId ? '#333' : '#252525',
                                borderRadius: '8px',
                                padding: '20px',
                                marginBottom: '20px',
                                borderLeft: `4px solid ${comment.userid === userId ? '#bb86fc' : '#03DAC6'}`,
                                position: 'relative'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '15px'
                                }}>
                                    <span style={{
                                        fontWeight: '600',
                                        color: comment.userid === userId ? '#bb86fc' : '#03DAC6'
                                    }}>
                                        {comment.username}
                                    </span>
                                    
                                    {comment.userid === userId && (
                                        <button 
                                            onClick={() => handleDelComment(comment._id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#ff4444',
                                                cursor: 'pointer',
                                                fontSize: '1rem'
                                            }}
                                            disabled={isLoading}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    )}
                                </div>

                                <p style={{ 
                                    marginBottom: '15px',
                                    lineHeight: '1.5'
                                }}>
                                    {comment.text}
                                </p>

                                {comment.code && (
                                    <div style={{ 
                                        position: 'relative',
                                        marginTop: '15px'
                                    }}>
                                        <button
                                            onClick={() => copyCode(comment.code, comment._id)}
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
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                fontSize: '0.8rem',
                                                zIndex: 1
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faCopy} />
                                            {copiedId === comment._id ? 'Copied!' : 'Copy'}
                                        </button>
                                        <pre style={{
                                            background: '#121212',
                                            padding: '20px',
                                            borderRadius: '8px',
                                            overflowX: 'auto',
                                            color: '#d4d4d4',
                                            fontFamily: 'monospace',
                                            whiteSpace: 'pre-wrap',
                                            margin: 0,
                                            position: 'relative'
                                        }}>
                                            {comment.code}
                                        </pre>
                                    </div>
                                )}

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginTop: '15px'
                                }}>
                                    <button
                                        onClick={() => handleUpVote(comment._id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: comment.userUpvoted ? '#bb86fc' : '#e0e0e0',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            fontSize: '0.9rem'
                                        }}
                                        disabled={isLoading || comment.userUpvoted}
                                    >
                                        <FontAwesomeIcon icon={faThumbsUp} />
                                        <span>{comment.upvote || 0}</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div style={{
                    background: '#1e1e1e',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #333'
                }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{
                            display: 'flex',
                            gap: '15px',
                            marginBottom: '15px',
                            alignItems: 'center'
                        }}>
                            <FontAwesomeIcon 
                                icon={faCommentDots} 
                                style={{ color: '#bb86fc', fontSize: '1.2rem' }} 
                            />
                            <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Type your comment..."
                                style={{
                                    flex: 1,
                                    background: '#252525',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    padding: '12px 15px',
                                    color: '#e0e0e0',
                                    fontSize: '1rem'
                                }}
                                disabled={isLoading}
                                required
                            />
                            <button
                                type="submit"
                                style={{
                                    background: '#bb86fc',
                                    color: '#121212',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '12px 20px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'background 0.2s'
                                }}
                                disabled={isLoading || !comment.trim()}
                                onMouseOver={(e) => {
                                    if (!isLoading && comment.trim()) {
                                        e.currentTarget.style.background = '#9b66f2';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!isLoading && comment.trim()) {
                                        e.currentTarget.style.background = '#bb86fc';
                                    }
                                }}
                            >
                                <FontAwesomeIcon icon={faPaperPlane} />
                                Post
                            </button>
                        </div>

                        <div style={{ marginTop: '15px' }}>
                            <Editor
                                height="150px"
                                language="javascript"
                                theme="vs-dark"
                                value={code}
                                onChange={(value) => setCode(value || '')}
                                options={{
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    fontSize: 14,
                                    lineNumbers: 'off',
                                    glyphMargin: false,
                                    folding: false,
                                    lineDecorationsWidth: 10,
                                    renderLineHighlight: 'none'
                                }}
                                loading={<div style={{ color: '#e0e0e0' }}>Loading editor...</div>}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Comments;