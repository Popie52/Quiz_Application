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

quizRouter.get('/mine', middleware.userExtractor, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ creator: req.user.id }).sort({ createdAt: -1 });

    res.json(quizzes);
  } catch (err) {
    console.error('Error fetching user quizzes:', err);
    res.status(500).json({ message: 'Failed to fetch your quizzes' });
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
    const { title, category, questions, isPublic } = req.body;
    if(!title || !questions || !questions.length) {
      return res
        .status(400)
        .json({ message: "Title and questions are required" });
    }

    const quiz = new Quiz({
      title,
      category,
      creator: req.user.id,
      questions,
      isPublic,
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    next(error);
  }
});


quizRouter.put('/quizzes/:id', middleware.userExtractor, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if the logged-in user is the creator
    if (quiz.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to edit this quiz' });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    res.json(updatedQuiz);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update quiz' });
  }
});

quizRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this quiz' });
    }

    await quiz.deleteOne();
    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete quiz' });
  }
});



export default quizRouter;