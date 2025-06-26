import ChatRoom from "./pages/Room/ChatRoomPage.js";
import Calender from "./pages/Calender/CalanderPage.js";
import CodeEditor from "./pages/Codeeditor/CodeEditorPage.js";
import ForgotPassword from "./pages/Auth/ForgotPasswordPage.js";
import HomePage from "./pages/Home/HomePage.js";
import LogIn from "./pages/Auth/LoginPage.js";
import SignUp from "./pages/Auth/SignUpPage.js";
import DashBoard from "./pages/Profile/Dashboard.js";
import Logout from "./pages/Auth/logout.js";
import Profile from "./pages/Profile/ProfilePage.js";
import Fetch from "./pages/Codeeditor/Fetch.js";
import { BrowserRouter , Routes , Route} from "react-router-dom";
import Question from "./pages/Question/Questions.js";
import Comments from "./pages/Question/Comments.js";
import ResetPassword from "./pages/Auth/ResetPassword.js";
import AccVerify from "./pages/Auth/AccVerify.js";
import AccEdit from "./pages/Profile/AccEditPage.js";
import First from "./pages/first.js"
import "./App.css";
function App() {
  return(<>
    <BrowserRouter>
    <Routes>
        <Route exact path="/" element={<HomePage/>}/>
        <Route exact path="/LogIn" element={<LogIn/>}/>
        <Route exact path="/ForgotPassword" element={<ForgotPassword/>}/>
        <Route exact path="/ForgotPassword/ResetPassword" element={<ResetPassword/>}/>
        <Route exact path="/SignUp" element={<SignUp/>}/>
        <Route exact path="/LogIn/:id" element={<First/>}/>
        <Route exact path="/LogIn/:id/ChatRoom" element={<ChatRoom/>}/>
        <Route exact path="/LogIn/:id/CodeEditor" element={<CodeEditor/>}/>
        <Route exact path="/LogIn/:id/Calender" element={<Calender/>}/>
        <Route exact path="/LogIn/:id" element={<DashBoard/>}/>
        <Route exact path="/LogIn/:id/:qid" element={<Question/>}/>
        <Route exact path="/LogIn/:id/:qid/Comments" element={<Comments/>}/>
        <Route exact path="/LogIn/:id/PublishQuestion" element={<Fetch/>}/>
        <Route exact path="/LogIn/:id/Calender" element={<DashBoard/>}/>
        <Route exact path="/LogIn/:id/LogOut" element={<Logout/>}/>
        <Route exact path="/LogIn/:id/Profile" element={<Profile/>}/>
        <Route exact path="/LogIn/:id/Profile/AccEdit" element={<AccEdit/>}/>
        <Route exact path="/LogIn/:id/Profile/AccVerify" element={<AccVerify/>}/>
    </Routes>
    </BrowserRouter>
  </>)
}

export default App;