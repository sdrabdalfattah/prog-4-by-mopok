const express = require("express");
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo');
const cors = require('cors');
require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express();
const session = require('express-session');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const cookieParser = require('cookie-parser');

const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/comment");
const upload = require("./middleware/multerConfig");

app.use(express.static("uploadsIMGS"));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true,   store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }) }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'))
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5000',
  methods: ['GET', 'POST'], 
}));

const DB_URI = process.env.MONGO_URI

mongoose.connect(DB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Error:", err));

  



  // google auth  // google auth  // google auth  // google auth  // google auth



  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback',
  },
  async function (token, tokenSecret, profile, done) {
    try {
      // البحث عن المستخدم في قاعدة البيانات باستخدام googleId
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        // إذا لم يكن المستخدم موجودًا، نقوم بإنشائه
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos ? profile.photos[0].value : ''
        });

        // حفظ المستخدم في قاعدة البيانات
        await user.save();
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));


passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use(passport.initialize());


app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);



app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function (req, res) {
    const user = req.user;


    const token = jwt.sign({
      googleId: user.googleId,
      email: user.email,
      name: user.name,
      avatar: user.avatar
    }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, 
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });



    res.redirect("http://localhost:5000/prog_4.html");
  }
);










  // google auth  // google auth  // google auth  // google auth  // google auth  // google auth



  


  function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).send("Access Denied: No Token Provided");
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).send("Invalid Token");
      }
  
      req.user = user;
      next();
    });
  }

  

  app.get("/", (req, res) => {
    res.redirect("/prog_4.html"); // أو أي صفحة رئيسية تريدها
  });
  

  app.get('/api/me', authenticateToken, (req, res) => {
    res.json(req.user);
  });


  app.post("/create-post", authenticateToken, (req, res, next) => {
    upload.single('post_photo')(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // خطأ multer مثل الحجم الزائد
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: "The image must be smaller than 500KB" });
        }
        return res.status(400).json({ error: err.message });
      } else if (err) {

        return res.status(400).json({ error: err.message });
      }
      next(); 
    });
  }, async (req, res) => {
    try {
      console.log(req.body);
      console.log(req.file);
      const { post_content, googleId } = req.body;
      const post_photo = req.file ? req.file.filename : null;
  
      if (post_content.trim() === "" || googleId == "") {
        return res.status(400).json({ error: "Type something first" });
      }
  
      if (post_content.length > 200) {
        return res.status(400).json({ error: "cant be higher then 200 letter" });
      }
  
      const user = await User.findOne({ googleId });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const newPost = new Post({
        post_content,
        googleId,
        user_name: user.name,
        user_photo: user.avatar,
        post_photo
      });
  
      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  
  
  
  
    
  app.get("/posts", async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });

      const postsWithCommentCountAndUserPhoto = await Promise.all(
        posts.map(async (post) => {
          const commentCount = await Comment.countDocuments({ postId: post._id });
          const user = await User.findOne({ googleId: post.googleId });
          const userPhoto = user ? user.avatar : null; 
          return {
            ...post._doc,       
            commentCount,      
            user_photo: userPhoto,  
          };
        })
      );
      res.json(postsWithCommentCountAndUserPhoto);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Error fetching posts" });
    }
  });
  
  
  




app.get("/comments/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments" });
  }
});



app.post("/create-comments", authenticateToken, async (req, res) => {
  const { postId, googleId, content } = req.body;

  if (content.length > 60) {
    return res.status(400).json({ error: "cant be higher then 60 letter" });
}

  try {
    const user = await User.findOne({ googleId });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const newComment = new Comment({
      postId,
      googleId,
      user_name: user.name,
      user_photo: user.avatar,
      content
    });

    const savedComment = await newComment.save();
    res.status(201).json({ message: "Comment added", comment: savedComment });
    console.log(user);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment" });
  }
});







app.get("/get-user", async (req, res) => {
  const { userId } = req.query;
  try {
    // احصل على بيانات المستخدم
    const user = await User.findOne({ googleId: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    const user_posts = await Post.find({ googleId: userId }).sort({ createdAt: -1 });

   
    const postIds = user_posts.map(post => post._id);


    const commentCounts = await Comment.aggregate([
      { $match: { postId: { $in: postIds } } },
      { $group: { _id: "$postId", count: { $sum: 1 } } }
    ]);


    const countMap = {};
    commentCounts.forEach(c => {
      countMap[c._id.toString()] = c.count;
    });


    const postsWithCounts = user_posts.map(post => {
      const postObj = post.toObject(); 
      postObj.commentCount = countMap[post._id.toString()] || 0;
      return postObj;
    });


    res.status(200).json({
      user,
      posts: postsWithCounts
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user" });
  }
});





app.delete("/delete-post", authenticateToken, async (req, res) => {
  const { postId } = req.query;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.googleId !== req.user.googleId) {
      return res.status(403).json({ message: "You are not allowed to delete this post" });
    }

    await Post.deleteOne({ _id: postId });
    await Comment.deleteMany({ postId: postId });

    res.status(200).json({ message: "Post and its comments deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});





  
  


app.post('/logout', (req, res) => {
  res.clearCookie("token", { path: "/", httpOnly: true, sameSite: "Lax" }); 
  res.status(200).json({ message: "تم تسجيل الخروج بنجاح" });
});





app.delete("/clear-database", async (req, res) => {
  try {
    const { password } = req.query;
    if (password !== "mopok99") {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    return res.status(200).json({ message: "Database cleared successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});


app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server is running on port ${process.env.PORT || 5000}`);
} );








