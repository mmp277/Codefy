import { User } from "../model/user.js";
import { Comment } from "../model/comment.js";
import { Upvote } from "../model/upvote.js";
import { Question } from "../model/question.js";
import mongoose from "mongoose";
import { isValidObjectId } from "../utils.js";
const errorResponse = (res, status, message) => {
  return res.status(status).json({
    error: true,
    message: message,
    data: null
  });
};

export async function Postcomment(req, res) {
  try {
    const { id: userid, qid } = req.params;
    const { text, code } = req.body;

    if (!text || text.trim() === "") {
      return errorResponse(res, 400, "Comment text cannot be empty");
    }

    const user = await User.findById(userid);
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    const newComment = await Comment.create({
      userid,
      text: text.trim(),
      username: user.username,
      questionid: qid,
      code: code || null,
      upvote: 0
    });

    return res.status(201).json({
      error: false,
      message: "Comment added successfully",
      data: newComment
    });

  } catch (error) {
    console.error("Postcomment Error:", error);
    return errorResponse(res, 500, error.message || "Failed to add comment");
  }
}

export async function Delcomment(req, res) {
  try {
    const { id: userid, qid, cid } = req.params;
    const user = req.user;

    const comment = await Comment.findOne({ _id: cid, userid, questionid: qid });
    if (!comment) {
      return errorResponse(res, 404, "Comment not found or unauthorized");
    }

    const result = await Comment.deleteOne({ _id: cid });
    if (result.deletedCount === 0) {
      return errorResponse(res, 500, "Failed to delete comment");
    }

    await Upvote.deleteMany({ entityid: cid });

    return res.status(200).json({
      error: false,
      message: "Comment deleted successfully"
    });

  } catch (error) {
    console.error("Delcomment Error:", error);
    return errorResponse(res, 500, error.message || "Failed to delete comment");
  }
}

export async function Upvotecomment(req, res) {
  try {
    const user = req.user;
    const { cid } = req.params;

    const comment = await Comment.findById(cid);
    if (!comment) {
      return errorResponse(res, 404, "Comment not found");
    }

    const existingUpvote = await Upvote.findOne({
      userid: user._id,
      entityid: cid
    });

    if (existingUpvote) {
      await Upvote.findByIdAndDelete(existingUpvote._id);
      comment.upvote = Math.max(0, comment.upvote - 1);
      await comment.save();

      return res.status(200).json({
        error: false,
        message: "Upvote removed successfully",
        data: comment.upvote
      });
    }

   
    await Upvote.create({ userid: user._id, entityid: cid });
    comment.upvote += 1;
    await comment.save();

    return res.status(200).json({
      error: false,
      message: "Comment upvoted successfully",
      data: comment.upvote
    });

  } catch (error) {
    console.error("Upvotecomment Error:", error);
    return errorResponse(res, 500, error.message || "Failed to process upvote");
  }
}

export async function Comments(req, res) {
  try {
    const { qid, id: userid } = req.params;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(qid) || 
        !mongoose.Types.ObjectId.isValid(userid)) {
      return errorResponse(res, 400, "Invalid ID format");
    }

    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      return errorResponse(res, 503, "Database not connected");
    }

    const question = await Question.findById(qid);
    if (!question) {
      return errorResponse(res, 404, "Question not found");
    }

    const comments = await Comment.find({ questionid: qid })
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({
      error: false,
      message: "Comments retrieved successfully",
      data: {
        comments,
        headline: question.headline
      }
    });

  } catch (error) {
    console.error("Comments Error:", error);
    return errorResponse(res, 500, error.message || "Failed to retrieve comments");
  }
}