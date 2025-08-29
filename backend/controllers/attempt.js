import Quiz from "../models/Quiz.js";
import express from "express";
import middleware from "../utils/middleware.js";
import Attempt from "../models/Attempt.js";

const attemptRouter = express.Router();

attemptRouter.post("/", middleware.userExtractor, async (req, res, next) => {
  try {
    const { quizId, answers } = req.body;
    const userId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    if (!answers || answers.length !== quiz.questions.length) {
      return res.status(400).json({ error: "Answers array length mismatch" });
    }

    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (q.correctAnswerIndex === answers[idx]) {
        score++;
      }
    });

    const attempt = new Attempt({
      quiz: quizId,
      user: userId,
      score,
      totalQuestions: quiz.questions.length,
      answers,
    });

    await attempt.save();

    res.status(201).json({
        attemptId: attempt._id,totalQuestions: quiz.questions.length,score,
    });
  } catch (error) {
    next(error);
  }
});

attemptRouter.get(
  "/review/:attemptId",
  middleware.userExtractor,
  async (req, res, next) => {
    try {
      const { attemptId } = req.params;
      const attempt = await Attempt.findById(attemptId).populate("quiz");

      if (!attempt) {
        return res.status(404).json({ error: "Attempt not found"});
      }

      if (attempt.user.toString() !== req.user.id) {
        return res.status(403).json({error: "Unauthorized"});
      }

      const review = attempt.quiz.questions.map((question, index) => ({
        questionText: question.questionText,
        options: question.options,
        correctAnswerIndex: question.correctAnswerIndex,
        selectedAnswerIndex: attempt.answers[index],
        isCorrect: question.correctAnswerIndex === attempt.answers[index],
      }));
      
      res.status(200).json({
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        review,
      })
    } catch (error) {
      next(error);
    }
  }
);


attemptRouter.get('/mine', middleware.userExtractor, async (req, res) => {
  try {
    const attempts = await Attempt.find({ user: req.user.id }) 
      .populate('quiz', 'title') 
      .sort({ createdAt: -1 });

    const formatted = attempts.map((attempt) => ({
      _id: attempt._id,
      quiz: {
        _id: attempt.quiz._id,
        title: attempt.quiz.title,
      },
      score: attempt.score,
      total: attempt.answers.length,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

attemptRouter.get('/:attemptId', middleware.userExtractor, async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const attempt = await Attempt.findById(attemptId).populate('quiz', 'title');

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    if (attempt.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({
      _id: attempt._id,
      quiz: {
        _id: attempt.quiz._id,
        title: attempt.quiz.title,
      },
      score: attempt.score,
      total: attempt.totalQuestions,
      answers: attempt.answers,
    });
  } catch (error) {
    next(error);
  }
});


export default attemptRouter;
