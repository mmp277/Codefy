import { Link, useParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightFromBracket, faCalendar, faCirclePlus, faCircleUser, faMessage, faCode } from '@fortawesome/free-solid-svg-icons'
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { useState } from 'react'
import axios from 'axios'
import './navbar.css';
import {  useEffect } from 'react';



function Navbar2() {
    const params = useParams()
    const userId = params.id
    const [searchWord, setSearchWord] = useState('')
    const [questionList, setQuestionList] = useState([])
    const [searchResults, setSearchResults] = useState(null)
    const navigate = useNavigate()


   const [accessToken, setAccessToken] = useState('')
    const [isSearching, setIsSearching] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('AccessToken')
        if (token) {
            setAccessToken(token)
        }
    }, [])
    const validateId = (id) => {
        return /^[0-9a-fA-F]{24}$/.test(id);
    };
    const handleSearch = async () => {
  try {
    if (!searchWord.trim()) {
      setSearchResults(null);
      setQuestionList([]);
      return;
    }

    if (!accessToken) {
      setSearchResults('Please log in to search');
      return;
    }

    setIsSearching(true);
    setSearchResults(null); 

    const response = await axios.post(
      `http://localhost:3001/LogIn/${userId}/Search`,
      {}, 
      {
        params: { 
          searchWord: encodeURIComponent(searchWord) 
        },
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        timeout: 5000 
      }
    );

    if (response.data.error) {
      throw new Error(response.data.message);
    }

    setQuestionList(response.data.questionList || []);
    setSearchResults(
      response.data.questionList?.length
        ? `Found ${response.data.questionList.length} results`
        : 'No results found'
    );

  } catch (error) {
    console.error('Search error:', {
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.response) {
      switch (error.response.status) {
        case 401:
          setSearchResults('Session expired. Please log in again.');
          break;
        case 404:
          setSearchResults('Search service unavailable');
          break;
        case 500:
          setSearchResults('Server error. Please try later.');
          break;
        default:
          setSearchResults(error.response.data?.message || 'Search failed');
      }
    } else if (error.request) {
      setSearchResults('Network error. Check your connection.');
    } else {
      setSearchResults('Search failed. Please try again.');
    }

    setQuestionList([]);
  } finally {
    setIsSearching(false);
  }
};
    return (<>
        <div className='navbar-wrapper' >

            <div className='flex' style={{ gap: '0.1vw', justifyContent: 'flex-start' }}>
                <Link className='link1' to={`/LogIn/${userId}/`}><p id="landingpage-heading" style={{ fontSize: '5vh', width: '8.9vw'}}>Codefy</p></Link>


                <p className='link' ><FontAwesomeIcon icon={faCalendar} style={{ color: 'black', fontSize: '3vh' }} onClick={() => { navigate(`/LogIn/${userId}/Calender`) }} /></p>
                <p className='link' ><FontAwesomeIcon icon={faCode} style={{ color: 'black', fontSize: '3vh' }} onClick={() => { navigate(`/LogIn/${userId}/CodeEditor`) }} />
                </p>
                <p className='link' ><FontAwesomeIcon icon={faMessage} style={{ color: 'black', fontSize: '3vh' }} onClick={() => { navigate(`/LogIn/${userId}/ChatRoom`) }} /></p>
                <p className='link' ><FontAwesomeIcon icon={faCirclePlus} style={{ color: 'black', fontSize: '3vh' }} onClick={() => { navigate(`/LogIn/${userId}/PublishQuestion`, { replace: true }) }} /></p>
            </div>
            <div className="search-outer-wrapper">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search users or questions..."
                        value={searchWord}
                        onChange={(e) => {
                            setSearchWord(e.target.value);
                            handleSearch();
                        }}
                    />
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="search-icon"
                        onClick={handleSearch}
                    />
                </div>

                {searchResults && (
    <div className="search-result-wrapper">
  {isSearching ? (
    <div>Searching...</div>
  ) : searchResults ? (
    questionList.length > 0 ? (
      <>
        <div>{searchResults}</div>
        {questionList.map((question) => (
          <p key={question._id} onClick={() => 
            navigate(`/LogIn/${userId}/${question._id}`)}>
            {question.headline}
          </p>
        ))}
      </>
    ) : (
      <div>{searchResults}</div>
    )
  ) : null}
</div>
)}
            </div>

            <div className='flex' style={{ gap: '0.1vw', justifyContent: 'flex-start' }}>
                <p className='link'> <FontAwesomeIcon icon={faArrowRightFromBracket} style={{ color: 'black', fontSize: '3vh' }} onClick={() => { navigate(`/LogIn/${userId}/logout`) }} /> </p>
                <p className='link'> <FontAwesomeIcon icon={faCircleUser} style={{ color: 'black', fontSize: '3vh' }} onClick={() => { navigate(`/LogIn/${userId}/Profile`) }} /> </p>
            </div>
        </div>
    </>)
}

export default Navbar2