const Post = require('../models/Post');

async function store(req, res) {
  const post = await Post.findById(req.params.id);

  post.likes += 1;

  await post.save();

  /* Emits like event to all users connected in application */
  req.io.emit('like', post);
  
  return res.json(post);
}


module.exports = {
  store
}