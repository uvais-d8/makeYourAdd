const path = require("path");
const nodemailer = require("nodemailer");
const User = require("../model/userModel");
const bcrypt = require("bcrypt");

const loadHome = async (req, res) => {
  try {
    console.log("loading home");
    console.log("req.session.user :",req.session.user);
    res.render("home");
  } catch (error) {
    console.log("error while load home");
  }
};
const loadService = async (req, res) => {
  try {
    res.render("services");
  } catch (error) {
    console.log("error : ", error);
  }
};
const loadSignUp = async (req, res) => {
  try {
    res.render("./signup");
  } catch (error) {
    console.log("error :", error);
  }
};
const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("Received data:", req.body);

    // Basic field validations
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Username validation (letters and spaces only)
    const usernameRegex = /^[A-Za-z\s]{3,40}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ message: "Username must be at least 3 characters and only contain letters/spaces" });
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Password validation (min 6 chars, at least 1 letter and 1 number)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$%^&+=!]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password must be at least 6 characters and include a number and a letter" });
    }

    // Check for existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // 🔒 Save user in session
    req.session.user = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };

    console.log("✅ User created and session set");
    res.status(200).json({ message: "✅ Signup successful", redirect: "/" });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


 const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'muhammeduvais6060@gmail.com',
    pass: 'wjpx ezmu koex eoxm'
  }
});
const sendEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  console.log('Incoming email request:', req.body);

  // Get email from session
  const senderEmail = req.session?.user?.email || 'default@gmail.com';
  console.log('Sender Email from Session:', req.session?.user);

  const mailOptions = {
    from: `"${name}" <${senderEmail}>`,
    to: 'muhammeduvais6060@gmail.com', // Change if needed
    subject: subject || 'New Contact Message',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    replyTo: email
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ message: 'Failed to send email. Please try again later.' });
  }
};


 
const loadLogin = async (req, res) => {
  res.render("login");
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ User not found');
      return res.status(400).json({ message: "❌ User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Incorrect password');
      return res.status(400).json({ message: "❌ Incorrect password" });
    }

  req.session.user = {
      id: user._id,
      email: user.email,
      name: user.name
  };


    console.log('✅ Login successful');
    console.log('user.email :',user.email);
    console.log('req.session.email :',req.session.user);
    return res.status(200).json({ message: "✅ Login successful", redirect: "/" });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ message: "❌ Server error" });
  }
};



module.exports = {
  loadService,
  loadHome,
  loadLogin,
  loginUser,
  createUser,
  loadSignUp,
  sendEmail
};
