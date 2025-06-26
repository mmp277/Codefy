import { User } from "../model/user.js";
import { Question } from "../model/question.js";
import { Upvote } from "../model/upvote.js";
import { Bookmark } from "../model/bookmark.js";
import mongoose from "mongoose";

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Question management
 */

/**
 * @swagger
 * /LogIn/{id}/publish:
 *   post:
 *     summary: Publish a new question
 *     tags: [Questions]
 */
export async function PublishQuestion(req, res) {
  try {
    const { headline, statement, code, visibility, lang } = req.body;
    const userid = req.params.id;

    if (!headline || !statement || !code) {
      return res.status(400).json({
        error: true,
        message: "Headline, statement, and code are required",
        data: null,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userid)) {
      return res.status(400).json({
        error: true,
        message: "Invalid user ID format",
        data: null,
      });
    }

    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
        data: null,
      });
    }

    const newQuestion = await Question.create({
      userid: userid,
      headline: headline,
      name: user.username,
      statement: statement,
      code: code,
      visibility: visibility || "public",
      upvote: 0,
      language: lang || "javascript",
    });

    return res.status(201).json({
      error: false,
      message: "Question published successfully",
      data: {
        id: newQuestion._id,
        headline: newQuestion.headline,
      },
    });

  } catch (error) {
    console.error("PublishQuestion Error:", error);
    return res.status(500).json({
      error: true,
      message: `Failed to publish question: ${error.message}`,
      data: null,
    });
  }
}

/**
 * @swagger
 * /LogIn/{qid}/upvote:
 *   post:
 *     summary: Upvote a question
 *     tags: [Questions]
 */
export async function UpvoteQues(req, res) {
  try {
    const userid = req.user._id;
    const questionid = req.params.qid;

    if (!mongoose.Types.ObjectId.isValid(userid) || 
        !mongoose.Types.ObjectId.isValid(questionid)) {
      return res.status(400).json({
        error: true,
        message: "Invalid ID format",
        data: null
      });
    }

    const existingUpvote = await Upvote.findOne({ 
      userid: userid, 
      entityid: questionid 
    });

    if (existingUpvote) {
      await Upvote.findByIdAndDelete(existingUpvote._id);
      const question = await Question.findByIdAndUpdate(
        questionid,
        { $inc: { upvote: -1 } },
        { new: true }
      );
      return res.status(200).json({
        error: false,
        message: "Upvote removed",
        data: { upvotes: question.upvote }
      });
    }

    await Upvote.create({ userid: userid, entityid: questionid });
    const question = await Question.findByIdAndUpdate(
      questionid,
      { $inc: { upvote: 1 } },
      { new: true }
    );

    return res.status(200).json({
      error: false,
      message: "Question upvoted",
      data: { upvotes: question.upvote }
    });

  } catch (error) {
    console.error("UpvoteQues Error:", error);
    return res.status(500).json({
      error: true,
      message: `Upvote failed: ${error.message}`,
      data: null
    });
  }
}

/**
 * @swagger
 * /LogIn/{id}/{qid}:
 *   get:
 *     summary: Get question details
 *     tags: [Questions]
 */
export async function Questions(req, res) {
  try {
    const userid = req.params.id;
    const qid = req.params.qid;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(userid) || 
        !mongoose.Types.ObjectId.isValid(qid)) {
      return res.status(400).json({
        error: true,
        message: "Invalid ID format",
        data: null
      });
    }

    const [user, question, upvoteCheck, bookmarkCheck] = await Promise.all([
      User.findById(userid),
      Question.findById(qid),
      Upvote.findOne({ userid: userid, entityid: qid }),
      Bookmark.findOne({ userid: userid, questionid: qid })
    ]);

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
        data: null
      });
    }

    if (!question) {
      return res.status(404).json({
        error: true,
        message: "Question not found",
        data: null
      });
    }

    return res.status(200).json({
      error: false,
      message: "Question retrieved",
      data: {
        headline: question.headline,
        name: question.name,
        statement: question.statement,
        code: question.code,
        upvote: question.upvote,
        language: question.language,
        visibility: question.visibility,
        createdAt: question.createdAt
      },
      isBookmarked: !!bookmarkCheck,
      isUpVoted: !!upvoteCheck
    });

  } catch (error) {
    console.error("Questions Error:", error);
    return res.status(500).json({
      error: true,
      message: `Failed to fetch question: ${error.message}`,
      data: null
    });
  }
}

/**
 * @swagger
 * /LogIn/{id}/{qid}:
 *   delete:
 *     summary: Delete a question
 *     tags: [Questions]
 */
export async function DelQuestion(req, res) {
  try {
    const userid = req.params.id;
    const qid = req.params.qid;
    const requestingUser = req.user;

    if (requestingUser._id.toString() !== userid) {
      return res.status(403).json({
        error: true,
        message: "Not authorized to delete this question",
        data: null
      });
    }

    const result = await Question.deleteOne({ 
      _id: qid, 
      userid: userid 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: true,
        message: "Question not found or already deleted",
        data: null
      });
    }

    await Promise.all([
      Upvote.deleteMany({ entityid: qid }),
      Bookmark.deleteMany({ questionid: qid })
    ]);

    return res.status(200).json({
      error: false,
      message: "Question deleted successfully",
      data: { questionId: qid }
    });

  } catch (error) {
    console.error("DelQuestion Error:", error);
    return res.status(500).json({
      error: true,
      message: `Failed to delete question: ${error.message}`,
      data: null
    });
  }
}