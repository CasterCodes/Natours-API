import User from "../models/userModel.js";
import CatchAsync from "../utils/CatchAsync.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import Email from "../utils/Email.js";
import crypto from "crypto";

const signToken = async (id) => {
  return await jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendCookie = (res, token) => {
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  });
};

export const signUp = CatchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  // asign token
  const token = await signToken(newUser._id);
  // send cookie
  sendCookie(res, token);
  res.status(201).json({
    status: "success",
    token: token,
    data: {
      user: newUser,
    },
  });
});

export const login = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // email validaition
  if (!email) {
    return next(new AppError("Provide an email", 401));
  }

  // password validation

  if (!password) {
    return next(new AppError("Provode an email", 401));
  }

  // check if user exits
  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect password or email", 401));
  }

  // generate token
  const token = await signToken(user._id);

  // send cookie
  sendCookie(res, token);

  res.status(200).json({
    status: "success",
    token,
  });
});

export const protect = CatchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(
      new AppError(
        "You are not logged in. Please login to access resources",
        401
      )
    );

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser)
    return next(new AppError("You are not recogized by the system", 401));

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password. Please login in again", 401)
    );
  }

  req.user = currentUser.name;

  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action")
      );
    }

    next();
  };
};
export const forgotPassword = CatchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new AppError("No User with that account", 404));

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  //reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/reset-password/${resetToken}`;

  const message = `Forgot your password ? Use this ${resetUrl} to reset your password`;

  try {
    await Email({
      email: user.email,
      subject: "Password reset Token",
      message: message,
      url: resetUrl,
    });

    res.status(200).json({
      status: "success",
      message: "Reset token sent",
    });
  } catch (error) {
    user.passwordRestToken = undefined;
    user.passwordResetTokenExpriresIn = undefined;
    await user.save({ validateBeforeSave: false });
    next(
      new AppError(
        "There was an error sending an email.Please try again later",
        500
      )
    );
  }
});

export const resetPassword = CatchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpriresIn: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("Token has expired or invalid token"));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordRestToken = undefined;
  user.passwordResetTokenExpriresIn = undefined;
  await user.save();

  const token = await signToken(user._id);
  sendCookie(res, token);

  res.status(200).json({
    status: "success",
    token: token,
  });
});
