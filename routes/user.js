const express = require("express");
const app = express();
const router = express.Router();
const dotenv = require("dotenv").config();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const path = require("path");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { verifyEmail } = require("../config/JWT");
const Otp = require("../models/otp");

router.get("/signup", (req, res) => {
  const password_cpassword = req.flash("password-cpassword");
  const not_register = req.flash("not-register");
  const signup_issue = req.flash("signup-issue");
  const user_exist = req.flash("user-exist");
  const prn_exist = req.flash("prn-exist");
  const empty_credentials = req.flash("empty-credentials");
  res.render("auth/signup", { password_cpassword, not_register, signup_issue, user_exist, prn_exist, empty_credentials });
});

// mail sender details
var transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  connectionTimeout:100000,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

router.post("/signup", async (req, res) => {
  let { name, email, PRN, password, password2 } = req.body;
  if (!name) {
    name = "";
  }
  if (!email) {
    email = "";
  }
  if (!PRN) {
    PRN = "";
  }
  if (!password) {
    password = "";
  }
  if (!password2) {
    password2 = "";
  }

  if (name == "" || email == "" || PRN == " " || password == "" || password2 == "") {
    req.flash("empty-credentials", "All fields are required for registering");
    res.redirect("/user/signup");
  } else {
    try {

      const usercheck = await User.findOne({ email: req.body.email });
      if (usercheck) {
        req.flash("user-exist", "User with that mail exists already");
        res.redirect("/user/signup");
      } else {
        const prncheck = await User.findOne({ PRN: req.body.PRN });
        if (prncheck) {
          req.flash("prn-exist", "User with that PRN is already registered");
          res.redirect("/user/signup");
        }
        else {
          if (password != password2) {
            req.flash(
              "password-cpassword",
              "Password and confirm password are not matching"
            );
            res.redirect("/user/signup");
          }
          else {
            const user = new User({
              name,
              email,
              PRN,
              password,
              emailToken: crypto.randomBytes(64).toString("hex"),
              isVerified: false,
            });
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(user.password, salt);
            user.password = hashPassword;
            const newUser = await user.save();

            // send mail
            var mailOptions = {
              from: ` "Verify your email" <wceit101@gmail.com>`,
              to: user.email,
              subject: "wceit101 - verify your email",
              html: `<h2> Hello ${user.name}!!</h2>
                    <h3>Thanks for registering on our site, Please verify email to continue ...</h3>
                    <a href = "http://${process.env.IP_ADDRESS}:${process.env.APP_PORT}/user/verify-email?token=${user.emailToken}">Verify your Email</a>`,
            };


            // sending mail
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log("Verification email is sent to your gmail account !!");
                req.flash(
                  "email-msg",
                  "Verification email is sent to your mail account !!"
                );
              }
            });

            req.flash(
              "register-email",
              "Verification email is sent to your mail account !!"
            );
            res.redirect("/user/login");
          }
        }
      }
    } catch (err) {
      req.flash("signup-issue", "Signup issue");
      res.redirect("/user/signup");
    }
  }
});

router.get("/verify-email", async (req, res) => {
  try {
    const token = req.query.token;
    const user = await User.findOne({ emailToken: token });
    if (user) {
      (user.emailToken = null), (user.isVerified = true), await user.save();
      req.flash("verify-email", "Your email has been verified !!");
      res.redirect("/user/login");
    } else {
      req.flash(
        "not-verify-email",
        "Your email has been not verified due to some issue !!"
      );
      res.redirect("/user/signup");
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/login", (req, res) => {
  const register_email = req.flash("register-email");
  const email_msg = req.flash("email-msg");
  const password_incorrect = req.flash("password-incorrect");
  const login_issue = req.flash("login-issue");
  const empty_credentials = req.flash("empty-credentials");
  const user_not_exist = req.flash("user-not-exist");
  const verify_email = req.flash("verify-email");
  const password_change = req.flash("password-change");
  res.render("auth/login", {
    register_email,
    password_incorrect,
    login_issue,
    empty_credentials,
    user_not_exist,
    email_msg,
    verify_email,
    password_change
  });
});

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge });

};

router.post("/login", verifyEmail, async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email) {
      email = "";
    }
    if (!password) {
      password = "";
    }

    if (email == "" && password == "") {
      req.flash("empty-credentials", "Empty credentials");
      res.redirect("/user/login");
    }
    const findUser = await User.findOne({ email: email });
    if (findUser) {
      const match = await bcrypt.compare(password, findUser.password);
      if (match) {
        const token = createToken(findUser.id);
        res.cookie("access-token", token);
        res.redirect("/home");
      } else {
        req.flash("password-incorrect", "Invalid Password/ Empty Credentials");
        res.redirect("/user/login");
      }
    } else {
      let msg = "User not registered";
      req.flash("not-register", "User is not register, please first register");
      res.redirect("/user/signup");
    }
  } catch (err) {
    console.log(err);
    req.flash("login-issue", "Login issue");
    res.redirect("/user/login");
  }
});

router.get("/logout", (req, res) => {
  res.cookie("access-token", "", { maxAge: 1 });
  res.redirect("/user/login");
});

router.get("/email-send", (req, res) => {
  const no_email = req.flash("no-email");
  const empty_credentials = req.flash("empty-credentials");
  const otp_expired = req.flash('otp-expired');
  res.render("auth/email-send", { otp_expired, no_email, empty_credentials });
});

router.post("/email-send", async (req, res) => {
  let { email } = req.body;
  if (!email) {
    email = '';
  }

  if (email == '') {
    req.flash('empty-credentials', "Please enter email");
    res.redirect('/user/email-sent');
  }
  else {
    let data = await User.findOne({ email: req.body.email });
    const responseType = {};
    if (data) {
      let otpcode = Math.floor(Math.random() * 10000 + 1);
      let otpData = new Otp({
        email: req.body.email,
        code: otpcode,
        expireIn: new Date().getTime() + 300 * 1000,
        // After 5 min  otp expire
      });
      let otpResponse = await otpData.save();

      var mailOptions = {
        from: ` "Password Reset" <wceit101@gmail.com>`,
        to: otpData.email,
        subject: "Please change your password",
        html: `<h2> ${otpData.email}! Please change the password !!</h2>
                    <h4> This is your OTP to change the password</h4>
                    <h2>${otpData.code}</h2>`,

        /*<a href = "http://${req.headers.host}/user/verify-email?token=${user.emailToken}">Verify your Email</a>`*/
      };

      // sending mail
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          // console.log("OTP is sent to your gmail account !!");
          // req.flash('otp-sent',"OTP is sent to your gmail account !!")
          res.redirect("/user/change-password");
        }
      });

      responseType.statusText = "Success";
      responseType.message = "Please Check Your Email Id";

      req.flash("otp-sent", "OTP is sent to your gmail account !!");
      res.redirect("/user/change-password");
    } else {
      responseType.statusText = "Error";
      responseType.message = "Email Id not exist";
      req.flash("no-email", "No such email is registered");
      res.redirect("/user/email-send");
    }
  }
});

router.get("/change-password", (req, res) => {
  const wrong_otp = req.flash("wrong-otp");
  const otp_sent = req.flash("otp-sent");
  const empty_credentials = req.flash('empty-credentials');
  res.render("auth/change-password", { wrong_otp, otp_sent, empty_credentials });
});

router.post("/change-password", async (req, res) => {
  let { email, otpcode, password } = req.body;
  if (!email) {
    email = '';
  }
  if (!otpcode) {
    otpcode = '';
  }
  if (!password) {
    password = '';
  }

  if (email == '' || otpcode == '' || password == '') {
    req.flash('empty-credentials', "Please fill all the fields");
    res.redirect('/user/change-password')
  }
  else {

    let data = await Otp.find({
      $and:
        [{ email: req.body.email },
        { code: req.body.otpcode }]
    }
    );
    const response = {};
    if (data) {
      let currentTime = new Date().getTime();
      let diff = data.expireIn - currentTime;
      if (diff < 0) {
        req.flash(
          "otp-expired",
          "Your otp for changing has expired, please send otp request again !!"
        );
        response.message = "Token expired";
        response.statusText = "error";
        res.redirect("/user/email-send");
      } else {
        let user = await User.findOne({ email: req.body.email });
        user.password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user.password, salt);
        user.password = hashPassword;
        user.save();
        response.message = "Password Changed Successfully";
        response.statusText = "Success";
        req.flash(
          'password-change',
          "Your password has been changed sucessfully !!"
        );
        res.redirect("/user/login");
      }
    } else {
      response.message = "Invalid Otp";
      response.statusText = "error";
      req.flash("wrong-otp", "OTP/email entered is incorrect");
      res.redirect("/user/change-password");
    }
  }
  //   res.status(200).json(response);
});

module.exports = router;
