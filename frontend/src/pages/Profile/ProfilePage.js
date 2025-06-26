import { faBookmark, faCheck } from "@fortawesome/free-solid-svg-icons";
import Navbar2 from "../../components/Navbar2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './dashboard.css';

const Profile = () => {
  const [user, setUser] = useState({
    username: "demo",
    techStack: "",
    language: "",
    ratingLeetCode: "",
    ratingCodeForces: "",
    ratingCodeChef: "",
    verfied: false,
  });
  const [publish, setPublish] = useState([]);
  const [bookmark, setBookmark] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const userId = params.id;
  const isFetchRef = useRef(false);

  const handleGetUser = async () => {
    try {
      const AccessToken = localStorage.getItem("AccessToken");
      localStorage.setItem("AccessToken", AccessToken);
      const response = await axios.get(
        `http://localhost:3001/LogIn/${userId}/Profile`,
        {
          headers: {
            'authorization': `Bearer ${AccessToken}`,
          },
        },
        { withCredentials: true }
      );
      const data = await response.data;
      if (data.error) {
        throw new Error(data.message);
      }
      setUser(data.user);
      setPublish(data.publish);
      setBookmark(data.bookmark);
      console.log(data.bookmark);
      console.log(data.publish);
    } catch (error) {
      alert("Error in fetching the user!", error.message);
      navigate(-1);
    }
  };
  useEffect(() => {
    if (!isFetchRef.current) {
      isFetchRef.current = true;
      handleGetUser();
    }
  },);

  const handleDelQuestion = async (qid) => {
    try {
      const AccessToken = localStorage.getItem("AccessToken");
      localStorage.setItem("AccessToken", AccessToken);
      const response = await axios.delete(
        `http://localhost:3001/LogIn/${userId}/${qid}/Del-Question`,
        {
          headers: {
            'authorization': `Bearer ${AccessToken}`,
          },
        },
        { withCredentials: true }
      );
      const data = await response.data;
      if (data.error) {
        throw new Error(data.message);
      }
      alert(data.message);
      handleGetUser();
    } catch (error) {
      alert("Error Occured in deleting\n", error.message);
    }
  };

  const handlePostBookmark = async (qid) => {
    try {
      const testPrompt = prompt("Type 'yes' to remove bookmark");
      if (testPrompt?.toLowerCase() !== "yes") {
        return;
      }

      const AccessToken = localStorage.getItem("AccessToken");
      const response = await axios.post(
        `http://localhost:3001/LogIn/${userId}/${qid}/Bookmark`,
        {},
        {
          headers: {
            'authorization': `Bearer ${AccessToken}`,
          },
          withCredentials: true
        }
      );
      const data = response.data;
      if (data.error) throw new Error(data.message);
      
      setBookmark(prevBookmarks => prevBookmarks.filter(item => item._id !== qid));
      
    } catch (error) {
      console.error("Bookmark error:", error);
      alert(`Bookmark error: ${error.response?.data?.message || error.message}`);
      handleGetUser();
    }
  };

  return (
    <>
      <Navbar2 />

      <div className="d-wrapper">
        <div
          className="flex"
          style={{ gap: "5vw", justifyContent: "flex-start" }}
        >
          {/* <img
            src=""
            style={{
              height: "30vh",
              width: "30vh",
              border: "2px solid black",
              borderRadius: "15vh",
            }}
          /> */}
          
          <div style={{paddingBottom:'2vh'}}>
            
            <h4>
              
              Username: {user.username}
              {user.verfied ? (
                <div
                  style={{
                    backgroundColor: "green",
                    width: "25px",
                    height: "25px",
                    textAlign: "center",
                    margin: "0px 4px",
                    borderRadius: "1000px",
                    display: "inline-block",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: "white", fontSize: "15px" }}
                  />
                </div>
              ) : (
                ""
              )}
            </h4>
            <h4>Preferred Tech Stack: {user.techStack}</h4>
            
            <h4>Preferred Programming Language: {user.language}</h4>
            <h4>‎ </h4>

            <h4>
              Rating on platforms:
              <div>
                <h5>Leetcode-{user.ratingLeetCode}</h5>
                <h5>Codeforces-{user.ratingCodeForces}</h5>
                <h5>Codechef-{user.ratingCodeChef}</h5>
              </div>
            </h4>
            <h4>‎ </h4>
            <div style={{ cursor: "pointer", color: "red" }}>
              {" "}
              <FontAwesomeIcon
                icon={faPenToSquare}
                style={{ fontSize: "2vh" }}
                onClick={() => {
                  navigate("AccEdit");
                }}
              />{" "}
              Edit Your Account
            </div>
          </div>
        </div>
        
        <div className="flex" style={{ gap: "2vw", alignItems: "flex-start" }}>
          
          <div
            className="ques-wrapper"
            id="publish-qs"
            style={{ flexDirection: "column", width: "45vw" }}
          >
            <h3>Bookmarked Questions</h3>
            {bookmark.map((item) => {
              return (
                <div
                  className="flex ques"
                  style={{
                    margin: "5px 0px ",
                    width: "90%",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  <p
                    className="ques-tag"
                    onClick={() => {
                      navigate(`/LogIn/${userId}/${item._id}`);
                    }}
                  >
                    Open
                  </p>
                  <p
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate(`/LogIn/${userId}/${item._id}`);
                    }}
                  >
                    {item.headline}
                  </p>
                  <FontAwesomeIcon
                    icon={faBookmark}
                    style={{ color: "#90FF69", fontSize: "4vh" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePostBookmark(item._id);
                    }}
                  />
                </div>
              );
            })}

          </div>

          <div
            className="ques-wrapper"
            id="bookmark-qs"
            style={{ flexDirection: "column", width: "45vw" }}
          >
            <h3>Published Questions</h3>
            {publish.map((item) => {
              return (
                <div
                  className="flex ques"
                  style={{
                    margin: "5px 0px ",
                    width: "90%",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                  key={item._id} 
                >
                  <p
                    className="ques-tag"
                    onClick={() => {
                      navigate(`/LogIn/${userId}/${item._id}`);
                    }}
                  >
                    Open
                  </p>
                  <p
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate(`/LogIn/${userId}/${item._id}`);
                    }}
                  >
                    {item.headline}
                  </p>
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ color: "red", fontSize: "4vh" }}
                    onClick={() => {
                      const testPrompt = prompt("Enter yes to remove published question");
                      if (testPrompt === "yes") {
                        handleDelQuestion(item._id);
                      }
                    }}
                  />
                </div>
              );
            })}

            {/* this is demo */}
            {/* <div className="flex ques" style={{ justifyContent: 'space-between' }} >
                                <p className="ques-tag" onClick={()=>{navigate(`/LogIn/123456/1234`)}}>Ques</p>
                                <p style={{cursor:'pointer'}} onClick={()=>{navigate(`/LogIn/123456/1234`)}}>Lorem wef ret uyuui oirf pod fuvk guk lob booooorr sjo...</p>
                                
                                <FontAwesomeIcon icon={faTrash} style={{ color: 'red', fontSize: '4vh' }} onClick={()=>{const testPrompt = prompt('Enter yes to remove bookmark')
                                if(testPrompt === 'yes'){
                                handleDelQuestion(12345)}}
                                }/>
                                </div> */}
          </div>
        </div>

        <div
          className="verify-Email-btn"
          style={{ position: "fixed", bottom: "30px", right: "30px" }}
        >
          {!user.verfied ? (
            <button
              style={{
                backgroundColor: "#4345E7",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontSize: "1.2rem",
                padding: "10px",
              }}
              onClick={() => {
                navigate("AccVerify");
              }}
            >
              Verify Email
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;