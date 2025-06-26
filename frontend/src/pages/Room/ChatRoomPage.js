// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';
// import Navbar2 from '../../components/Navbar2';
// import './ChatRoomPage.css'
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
// import { useParams } from 'react-router-dom';



// const ChatRoom = () => {
//   const [message, setMessage] = useState('');
//   const [chat, setChat] = useState([]);
//   const [socket, setSocket] = useState(null);
//   const params = useParams();
//   const userid = params.id;

//   useEffect(() => {
//     const newSocket = io('http://localhost:3001', { 
//       withCredentials: true,
//       reconnectionAttempts: 5
//     });
//     setSocket(newSocket);

//     newSocket.on('message', (msg) => {
//       setChat(prev => [...prev, msg]);
//     });

//     return () => newSocket.disconnect();
//   }, []);

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (message.trim() && socket) {
//       socket.emit('message', {
//         userid: userid,
//         message: message.trim()
//       });
//       setMessage('');
//     }
//   };

//   return (
//     <>
//       <Navbar2 />
//       <div className="chat-outer-wraperr">
//         <div className="chat-wrapper">
//           {chat.map((message, index) => (
//             <div key={index} className={message.username === 'system' ? 'system-msg' : 'user-msg'}>
//               <strong>{message.username === 'system' ? 'System' : message.username}</strong>: {message.message}
//             </div>
//           ))}
//         </div>
//         <form onSubmit={sendMessage} style={{ display: 'flex', margin: '3px 20px', backgroundColor: 'white', border: '2px solid #FF786B', borderRadius: '100px' }}>
//           <input 
//             type="text" 
//             style={{ borderRadius: '100px', padding: '10px', width: '100%' }} 
//             placeholder="Send a message" 
//             value={message} 
//             onChange={(e) => setMessage(e.target.value)} 
//             required 
//           />
//           <button 
//             style={{ padding: '10px 20px', border: 'none', color: 'white', backgroundColor: '#FF786B', cursor: 'pointer', borderRadius: '1000px', zIndex: '2' }} 
//             type="submit"
//           >
//             <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: '3vh', color: 'white' }} />
//           </button>
//         </form>
//       </div>
//     </>
//   );
// };
// export default ChatRoom



import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Navbar2 from '../../components/Navbar2';
import './ChatRoomPage.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft, faDumpster, faPaperPlane, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useParams } from 'react-router-dom';

const ChatRoom = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [socket, setSocket] = useState(null);
  const params = useParams();
  const userid = params.id;

  // Load messages from sessionStorage on component mount
  useEffect(() => {
    const savedChat = sessionStorage.getItem('chatMessages');
    if (savedChat) {
      setChat(JSON.parse(savedChat));
    }
  }, []);

  useEffect(() => {
    const newSocket = io('http://localhost:3001', { 
      withCredentials: true,
      reconnectionAttempts: 5
    });
    setSocket(newSocket);

    newSocket.on('message', (msg) => {
      setChat(prev => {
        const newChat = [...prev, msg];
        // Save to sessionStorage whenever chat updates
        sessionStorage.setItem('chatMessages', JSON.stringify(newChat));
        return newChat;
      });
    });

    return () => newSocket.disconnect();
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit('message', {
        userid: userid,
        message: message.trim()
      });
      setMessage('');
    }
  };

  // Clear chat only when needed (e.g., on logout)
  const clearChat = () => {
    const testPrompt = prompt("Are You sure, You want to delete chat history? Type yes to confirm.");
      if (testPrompt?.toLowerCase() !== "yes") {
        return;
      }
      sessionStorage.removeItem('chatMessages');
    setChat([]);
  };

  return (
    <>
      <Navbar2 />
      <div className="chat-outer-wraperr">
        <div className="chat-wrapper" >
          {chat.map((message, index) => (
            <div key={index} className={message.username === 'system' ? 'system-msg' : 'user-msg'}>
              <strong>{message.username === 'system' ? 'System' : message.username}</strong>: {message.message}
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} style={{ display: 'flex', backgroundColor: '#161b22',  borderRadius: '100px' }}>
          <input 
            type="text" 
            style={{ borderRadius: '100px', paddingLeft: '15px', width: '100%',border: '2px solid #FF786B' }} 
            placeholder="Send a message" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            required 
          />
          <button 
            style={{ padding: '10px 20px', border: 'none', color: 'white', backgroundColor: '#FF786B', cursor: 'pointer', borderRadius: '20px', zIndex: '2',margin:'0 5px' }} 
            type="submit"
          >
            <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: '3vh', color: 'white' }} />
          </button>
          <button 
            style={{ padding: '10px 20px', border: 'none', color: 'white', backgroundColor: '#FF786B', cursor: 'pointer', borderRadius: '20px', zIndex: '2' }} 
            onClick={clearChat}
          >
            <FontAwesomeIcon icon={faTrash} style={{ fontSize: '3vh', color: 'white' }} />
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatRoom;