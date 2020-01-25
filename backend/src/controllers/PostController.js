const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const Post = require('../models/Post');

/**
 * Return all posts
 * @param {*} req 
 * @param {*} res 
 */
async function index(req, res) {

  /* Find all and sort. Most recents first */
  const posts = await Post.find().sort('-createdAt');

  return res.json(posts);
}

/**
 * Stores post on MongoDB
 * @param {*} req 
 * @param {*} res 
 */
async function store(req, res) {
  const { author, place, description, hashtags } = req.body;
  const { filename: image } = req.file;

  /* set JPG extension for all images */
  const [ name ] = image.split('.');
  const fileName = `${name}.jpg`;

  /* resizes image and save on 'resized' folder */
  await sharp(req.file.path)
    .resize(500)
    .jpeg({ quality: 70 })
    .toFile(
      path.resolve(req.file.destination, 'resized', fileName)
    )

  /* deletes original file */
  fs.unlinkSync(req.file.path);

  /* creates post on MongoD */
  const post = await Post.create({
    author,
    place,
    description,
    hashtags,
    image: fileName
  });

  /* Emits to all listeners, new post created */
  req.io.emit('post', post);

  return res.json(post);
}


module.exports = {
  index,
  store
}