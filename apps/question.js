import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";
import { validatePost } from "../middlewares/validatePost.js";

const questionRouter = Router();

questionRouter.get("/", async (req, res) => {
  try {
    const title = req.query.keywords;
    const category = req.query.category;
    const query = {};
    if (title) {
      query.title = new RegExp(title, "i");
    }
    if (category) {
      query.category = new RegExp(category, "i");
    }
    const collection = db.collection("quora");
    const allQuestion = await collection.find(query).limit(10).toArray();
    return res.json({ data: allQuestion });
    // const collection = db.collection("quora");
    // const allQuestion = await collection.find({}).limit(10).toArray();
    // return res.json({ data: allQuestion });
  } catch (error) {
    return res.json({
      message: `Error`,
    });
  }
});

questionRouter.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("quora");
    const questionId = new ObjectId(req.params.id);
    const questionById = await collection.findOne({ _id: questionId });

    return res.json({ data: questionById });
  } catch (error) {
    return res.json({
      message: `Error`,
    });
  }
});

questionRouter.post("/", validatePost, async (req, res) => {
  try {
    const collection = db.collection("quora");
    const question = { ...req.body };
    const newQuestion = await collection.insertOne(question);
    return res.json({
      message: `Question id ${newQuestion.insertedId} has been created successfully`,
    });
  } catch (error) {
    return res.json({
      message: `Error`,
    });
  }
});

questionRouter.put("/:id", validatePost, async (req, res) => {
  try {
    const collection = db.collection("quora");
    const updatePostData = { ...req.body };

    const postId = new ObjectId(req.params.id);

    const post = await collection.findOne({ _id: postId });
    const postTitle = post ? post.title : "Unknown";

    await collection.updateOne(
      {
        _id: postId,
      },
      {
        $set: updatePostData,
      }
    );
    return res.json({
      message: `Post ${postTitle}} has been updated successfully`,
    });
  } catch (error) {
    return res.json({
      message: `Error`,
    });
  }
});

questionRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("quora");
    const postId = new ObjectId(req.params.id);

    const post = await collection.findOne({ _id: postId });
    const postTitle = post ? post.title : "Unknown";

    await collection.deleteOne({ _id: postId });
    return res.json({
      message: `Post ${postTitle} has been deleted successfully`,
    });
  } catch (error) {
    return res.json({
      message: `Error`,
    });
  }
});

export default questionRouter;
