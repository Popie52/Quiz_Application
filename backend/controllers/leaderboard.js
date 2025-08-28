import express from "express";
import Attempt from "../models/Attempt.js";

const leaderBoardRouter = express.Router();

leaderBoardRouter.get("/:quizId", async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const topAttempts = await Attempt.find({ quiz: quizId })
      .sort({ score: -1, attemptedAt: 1 })
      .limit(5)
      .populate("user", "username");
    const leaderboard = topAttempts.map((attempt) => ({
      username: attempt.user.username,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      attemptedAt: attempt.attemptedAt,
    }));

    res.status(200).json(leaderboard);
  } catch (error) {
    next(error);
  }
});

export default leaderBoardRouter;
