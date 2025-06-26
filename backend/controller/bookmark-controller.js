import { Bookmark } from "../model/bookmark.js";
import { Question } from "../model/question.js";
export async function BookmarkQues(req,res){
    try{
        const userid=req.user._id
        const questionid=req.params.qid
        const BookmarkCheck = await Bookmark.findOne({userid:userid , questionid:questionid})
        if(BookmarkCheck!== null){
            const UnMark = await Bookmark.findByIdAndDelete(BookmarkCheck._id)
            if(!UnMark){
                throw new Error(500 , "Bookmark not removed due to technical error")
            }
            return res.status(200).json({
                "error":false,
                "message":"Bookmark Removed Succeesfully",
                "data":UnMark
            })
        }
        const newBookmark= await Bookmark.create({userid:userid , questionid:questionid})
        if(!newBookmark){
            throw new Error(500 , "Question Bookmark unsuccessfull")
        }
        return res.status(200).json({
            "error":false,
            "message":"Question Bookmarked Successfully",
            "data":newBookmark
        })
    }catch(error){
        return res.status(500).json({
            "error":true,
            "message":"server Error occured",
            "data":null
        })
    }
}
export async function Search(req, res) {
    try {
    const searchWord = req.query.searchWord;
    const userId = req.params.id;
        
        if (!searchWord || searchWord.trim() === "") {
            return res.status(200).json({
                error: false,
                message: "Empty search",
                questionList: []
            });
        }

        console.log(`Searching for: ${searchWord}`);
        
        const questions = await Question.find({
            headline: { $regex: searchWord, $options: 'i' }
        }).limit(5).exec();

        console.log(`Found ${questions.length} results`);
        
        res.status(200).json({
            error: false,
            message: questions.length ? "Results found" : "No results",
            questionList: questions
        });
    } catch (error) {
        console.error("Search controller error:", error);
        res.status(500).json({
            error: true,
            message: error.message || "Search failed",
            questionList: []
        });
    }
}
