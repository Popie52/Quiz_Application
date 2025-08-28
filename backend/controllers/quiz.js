import Quiz from "../models/Quiz.js";
import express from "express";
import middleware from "../utils/middleware.js";

const quizRouter = express.Router();

quizRouter.get("/", async (req, res, next) => {
  try {
    const category = req.query.category;
    const filter = category ? { category } : {};
    const quizzes = await Quiz.find(filter).select(
      "title category creator createdAt"
    );
    res.json(quizzes);
  } catch (error) {
    next(error);
  }
});

quizRouter.get("/:id", async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const quizToSend = {
      _id: quiz._id,
      title: quiz.title,
      category: quiz.category,
      questions: quiz.questions.map((q) => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
      })),
    };

    res.json(quizToSend);
  } catch (error) {
    next(error);
  }
});

quizRouter.post("/", middleware.userExtractor, async (req, res, next) => {
  try {
    const { title, category, questions } = req.body;
    if (!title || !questions || !questions.length) {
      return res
        .status(400)
        .json({ message: "Title and questions are required" });
    }

    const quiz = new Quiz({
      title,
      category,
      creator: req.user.id,
      questions,
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    next(error);
  }
});



export default quizRouter;