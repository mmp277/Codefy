import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from '@monaco-editor/react'
import './CodeEditorPage.css'
import Navbar2 from '../../components/Navbar2';
import axios from 'axios';
const CodeEditor = ()=>{
    
    const [code , setCode]=useState("");
    const [input , setInput] = useState("");
    const [lang , setLang]=useState("cpp")
    const [output , setOutput] = useState('')
    const [errorCase , setErrorCase]= useState('')
    const params = useParams()
    const userId = params.id
    
    const handlePostCode = async()=>{
        try{
            if(code.trim() === ""){
                throw new Error('Enter Code to compile')
            }
            const response = await axios.post(`http://localhost:3001/LogIn/${userId}/CodeEditor/${lang}` , {code , input} , {withCredentials:true})
            const data = await response.data
            if(data.error){
                throw new Error(data.message)
            }
            setOutput(data.output)
        }catch(error){
            setErrorCase(`Error! ${error.message}`)
        }
    }
    
    
    return(<>
        <Navbar2/>
        <div className="CodeEditor-wrapper">
        <div style={{textAlign:'center'}}>{errorCase}</div>
        <div className="lang-selector-wrapper-2">
        <div className='lang-selector-wrapper'>
        <button className="lang-btn" style={{background:lang==='java' ? "black":"white" , color:lang==='java' ? "white":"black"}} onClick={e=>{setLang('java')}}>Java</button>
        <button className="lang-btn" style={{background:lang==='python' ? "black":"white" , color:lang==='python' ? "white":"black"}} onClick={e=>{setLang('python')}}>Python</button>
        <button className="lang-btn" style={{background:lang==='cpp' ? "black":"white" , color:lang==='cpp' ? "white":"black"}} onClick={e=>{setLang('cpp')}}>C++</button>
        </div>
        <div className='result-btn-wrapper'>
        <button onClick={handlePostCode}>Run & Compile</button>
        </div>
        </div>
        
        <div style={{display:'flex'}}>
        <div className="code-space">
        <Editor 
        theme='vs-dark'
        height="70vh"
        width="59vw"
        defaultLanguage={lang}
        defaultValue=''
        onChange={e=>{
            setCode(e)
            console.log(code)
        }}/>  
        </div>
        
        <div>
        <div className='input-wrapper' style={{width:"35vw" , height:"20vh" , margin:' 0px 20px 10px 20px'}}>
        <textarea onChange={(e)=>{setInput(e.target.value)}} className='input-space' placeholder='Standard Input(if any)' style={{width:"100%" , height:"90%" , backgroundColor:"black" , color:"white"}}/>
        </div>
        
        <div className='terminal-box' style={{width:'35vw', color:'white' ,padding:'2px', borderRadius:'5px' ,height:"48vh" ,margin:' 0px 20px 10px 20px', background:"#10100e"}}>
        <p>Output terminal:</p>
        {output}
        </div>
        </div>
        </div>
        </div>
        </>)
    }
    
    export default CodeEditor