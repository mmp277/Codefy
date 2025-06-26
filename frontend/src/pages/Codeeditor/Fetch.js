import Navbar2 from "../../components/Navbar2";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import './Fetch.css';

const Fetch = () => {
    const params = useParams();
    const userId = params.id;
    const navigate = useNavigate();

    const [code, setCode] = useState("");
    const [lang, setLang] = useState("cpp");
    const [headline, setHeadline] = useState('');
    const [statement, setStatement] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState('Public');

    const handlePostPublish = async () => {
        try {
            if (headline.trim() === '' || statement.trim() === '' || code.trim() === '') {
                alert('All fields are required!!');
                return;
            }
            const AccessToken = localStorage.getItem('AccessToken');
            const visibility = selectedPlatform === 'Public';
            const response = await axios.post(
                `http://localhost:3001/LogIn/${userId}/PublishQuestion`,
                { headline, statement, code, visibility, lang },
                {
                    headers: {
                        'authorization': `Bearer ${AccessToken}`
                    },
                    withCredentials: true
                }
            );
            const data = response.data;
            if (data.error) {
                throw new Error(data.message);
            }
            alert('Question Posted');
            navigate(`/LogIn/${userId}`, { replace: true });
        } catch (error) {
            alert(`Error in Posting Question!\n${error.message}`);
        }
    };

    useEffect(() => {
        console.log(selectedPlatform);
    }, [selectedPlatform]);

    return (
        <>
            <Navbar2 />
            <div className='body-wrapper'>
                <div style={{ width: '95vw' }}>
                    <form
                        className="flex2"
                        style={{ alignItems: 'flex-start', rowGap: '2vh' }}
                        onSubmit={e => {
                            e.preventDefault();
                            handlePostPublish();
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Question Headline"
                            onChange={e => setHeadline(e.target.value)}
                            style={{ width: '93vw', fontSize: '2.5vh', color: '#FF786B',letterSpacing: '0.1rem' }}
                            required
                        />
                        <div className="flex">
                            <p style={{ fontSize: '2.7vh' }}>
                                Visibility:
                                <span style={{ fontStyle: "italic", fontSize: '10px', color: 'red', marginLeft: 4 }}>
                                    (default is public)
                                </span>
                            </p>
                            <div className="flex">
                                <input
                                    type="radio"
                                    name="platform"
                                    id="Private"
                                    value="Private"
                                    checked={selectedPlatform === 'Private'}
                                    onChange={() => setSelectedPlatform('Private')}
                                    style={{ height: '3vh', width: '2vw' }}
                                />
                                <label htmlFor="Private">Private</label>
                            </div>
                            <div className="flex">
                                <input
                                    type="radio"
                                    name="platform"
                                    id="Public"
                                    value="Public"
                                    checked={selectedPlatform === 'Public'}
                                    onChange={() => setSelectedPlatform('Public')}
                                    style={{ height: '3vh', width: '2vw' }}
                                />
                                <label htmlFor="Public">Public</label>
                            </div>
                        </div>
                        <textarea
                            placeholder="Question Statement"
                            style={{ width: '93vw', height: '20vh', border: 'none', borderRadius: '2vh', padding: '2vh' }}
                            onChange={e => setStatement(e.target.value)}
                            required
                        />

                        <div className="search-results" style={{ backgroundColor: 'black' }}>
                            <div className="lang-selector-wrapper">
                                <button
                                    type="button"
                                    className="lang-btn"
                                    style={{
                                        background: lang === 'java' ? "black" : "white",
                                        color: lang === 'java' ? "white" : "black"
                                    }}
                                    onClick={() => setLang('java')}
                                >
                                    Java
                                </button>
                                <button
                                    type="button"
                                    className="lang-btn"
                                    style={{
                                        background: lang === 'python' ? "black" : "white",
                                        color: lang === 'python' ? "white" : "black"
                                    }}
                                    onClick={() => setLang('python')}
                                >
                                    Python
                                </button>
                                <button
                                    type="button"
                                    className="lang-btn"
                                    style={{
                                        background: lang === 'cpp' ? "black" : "white",
                                        color: lang === 'cpp' ? "white" : "black"
                                    }}
                                    onClick={() => setLang('cpp')}
                                >
                                    C++
                                </button>
                            </div>
                            <Editor
                                height='30vh'
                                width='90vw'
                                theme='vs-dark'
                                language={lang}
                                value={code}
                                onChange={value => setCode(value || '')}
                            />
                        </div>
                        <input
                            className='login-submit'
                            style={{ width: '15vw', backgroundColor: "#969696" }}
                            type='submit'
                            value="Publish Question"
                        />
                    </form>
                </div>
            </div>
        </>
    );
};

export default Fetch;
