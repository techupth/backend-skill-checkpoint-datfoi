export const validatePost = (req, res, next) => {
  const postData = req.body;

  if (!postData.title) {
    return res.status(400).json({
      message: `Title is required`,
    });
  }

  if (!postData.content) {
    return res.status(400).json({
      message: `Content is required`,
    });
  }

  if (!Array.isArray(postData.category) || postData.category.length < 1) {
    return res.status(400).json({
      message: `Must has at least 1 category`,
    });
  }

  next();
};
