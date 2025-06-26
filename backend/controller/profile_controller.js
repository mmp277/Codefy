import {
  authMiddleware,
  generateAccessTokenUtils,
  generateRefreshTokenUtils,
  otpGeneratorAndMailer,
  mailUtil,
} from "../utils.js"
import { User } from "../model/user.js"
import { Question } from "../model/question.js"
import { Bookmark } from "../model/bookmark.js"
export async function Profile(req, res) {
  try {
    const userid = req.params.id;
    const user = await User.findById(userid).select("-password -refreshToken");
    if (!user) {
      throw new Error("Server Error Occured");
    }
    let bookmarkQuestions = [];
    const bookmarks = await Bookmark.find({ userid: userid })
      .sort({ createdAt: 1 })
      .exec();
    if (bookmarks && bookmarks.length > 0) {
      const bookmarkPromises = bookmarks.map(async (element) => {
        if (element.questionid !== "undefined") {
          return await Question.findById(element.questionid);
        }
      });
      bookmarkQuestions = await Promise.all(bookmarkPromises);
      bookmarkQuestions = bookmarkQuestions.filter((q) => q !== undefined);
    }
    console.log(`qs:${bookmarkQuestions}`);
    const publish = await Question.find({ userid: userid })
      .sort({ createdAt: 1 })
      .exec();
    if (!publish) {
      publish = [];
    }
    return res.status(200).json({
      error: false,
      message: "Success",
      user: user,
      publish: publish,
      bookmark: bookmarkQuestions,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error Occured",
      user: null,
      bookmark: null,
      publish: null,
    });
  }
}
export async function AccEdit(req, res) {
  try {
    const techStack = req.body.techStack;
    const language = req.body.language;
    const codeforces = req.body.codeforces;
    const codechef = req.body.codechef;
    const leetcode = req.body.leetcode;
    const password = req.body.password;

    const user = await User.findById(req.user._id);
    const passwordCheck = await user.isPasswordCorrect(password);
    if (!passwordCheck) {
      mailUtil(
        user.email,
        "ALERT!!!Someone tried to make changes to your Codefy Account with a incorrect Password!!"
      );
      return res.status(401).json({
        user: null,
        error: true,
        message: "Incorrect Password",
      });
    }

    user.techStack = techStack;
    user.language = language;
    user.ratingCodeForces = codeforces;
    user.ratingCodeChef = codechef;
    user.ratingLeetCode = leetcode;

    await user.save({ validateBeforSave: false });
    return res.status(200).json({
      user: null,
      error: false,
      message: "Changes Saved!",
    });
  } catch (error) {
    console.log(error);
    return res.status(505).json({
      user: null,
      error: true,
      message:
        "Changes could not Saved due to Server Issues! Sorry for the inconvinience. Please Try later",
    });
  }
}
export async function GetQuestion(req,res){
    try{
        const feed = await Question.find({visibility:true}).sort({createdAt : -1}).exec()
        if(!feed){
            throw new Error("Server Error Occured")
        }
        const topFeed=feed.slice(0,10)
        return res.status(200).json({
            "error":false,
            "message":"Feed successfull",
            "data":topFeed
        })
    }catch(error){
        return res.status(500).json({
            "error":true,
            "message":"Server Error Occured",
            "data":null
        })
    }
}


