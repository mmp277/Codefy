import express from 'express'
import {authMiddleware } from '../utils.js'
import {Signup,Login,ForgotPassword,ResetPassword,OTPver,OTPfinal,Logout} from '../controller/user-controller.js'
import { Profile, AccEdit, GetQuestion } from '../controller/profile_controller.js';
import { Postcomment,Delcomment,Upvotecomment,Comments } from '../controller/comment-controller.js';
import {Questions,DelQuestion,PublishQuestion,UpvoteQues} from '../controller/question-controller.js';
import { BookmarkQues,Search } from '../controller/bookmark-controller.js';
import { CodeEditorFunc } from '../controller/codeeditor-controler.js';
const route=express.Router();
route.post('/SignUp',Signup);
route.get('/LogIn/:id/Profile/AccVerify',authMiddleware,OTPver);
route.post('/LogIn/:id/Profile/AccVerify',authMiddleware,OTPfinal);
route.post('/LogIn',Login);
route.post('/ForgotPassword',ForgotPassword);
route.post('/ForgotPassword/ResetPassword',ResetPassword);
route.get('/LogIn/:id/LogOut',Logout);
route.get('/LogIn/:id/Profile',authMiddleware,Profile);
route.put('/LogIn/:id/Profile/AccEdit',authMiddleware,AccEdit);
route.get('/LogIn/:id',authMiddleware,GetQuestion);
route.post('/LogIn/:id/:qid/Post-Comment',authMiddleware,Postcomment);
route.delete('/LogIn/:id/:qid/Del-Comment/:cid',authMiddleware,Delcomment);
route.post('/LogIn/:id/:qid/Comment/:cid/Comment-UpVote',authMiddleware,Upvotecomment);
route.get('/LogIn/:id/:qid/Comment',authMiddleware,Comments);
route.post('/LogIn/:id/PublishQuestion',authMiddleware,PublishQuestion);
route.post('/LogIn/:id/:qid/Question-UpVote',authMiddleware,UpvoteQues);
route.get('/LogIn/:id/:qid',authMiddleware,Questions);
route.delete('/LogIn/:id/:qid/Del-Question',authMiddleware,DelQuestion);
route.post('/LogIn/:id/:qid/Bookmark',authMiddleware,BookmarkQues);
route.post('/LogIn/:id/Search',authMiddleware,Search);
route.post('/LogIn/:id/CodeEditor/:lang',CodeEditorFunc);
export default route;
