const path = require("path");
const nodemailer = require("nodemailer");
const User = require("../model/userModel");
const bcrypt = require("bcrypt");

const loadHome = async (req, res) => {
  try {
    console.log("loading home");
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

    // Username validation (letters, numbers, dots, underscores, and hyphens)
    const usernameRegex = /^[A-Za-z\s]{3,40}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ message: "username must need 3 charecters" });
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Password strength validation (min 6 chars, at least 1 number, 1 letter)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$%^&+=!]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password must be at least 6 characters and include a number and a letter" });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    console.log("✅ User created successfully");
    res.status(200).json({ message: "✅ Signup successful", redirect: "/" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
}; 

const sendEmail = async (req, res) => {
  const { name, email, subject, message } = req.body; // 'name' instead of 'username'
  console.log('req.body:', req.body);

  const mailOptions = {
    from: `"${name}" <yourapp@gmail.com>`,
    to: 'makeyouradd@gmail.com',
    subject: subject || 'New Contact Message', // Use subject from form
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    replyTo: email
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error sending email' });
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

    // ✅ Login success - optionally set session or token here
    console.log('✅ Login successful');
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
