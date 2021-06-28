import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
      maxlength: [40, "User name should not be more than 40 characters "],
      minlength: [6, "User name should have more than 6 characters"],
    },
    email: {
      type: String,
      required: [true, "User should have a email"],
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Email must be valid",
      },
    },
    password: {
      type: String,
      required: [true, "A user must have a password"],
      min: [6, "A password is should have more than six characters"],
    },
    passwordConfirm: {
      type: String,
      required: [true, "A user must have confirm a password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passswords should match",
      },
    },
    passwordChangedAt: {
      type: Date,
    },
    photo: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "guide", "lead-guide", "admin"],
      default: "user",
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpriresIn: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre(/^find/, function (next) {
  this.select("-_v");
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified() || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// instance methods
userSchema.methods.correctPassword = async (candidatePassword, dbpassword) => {
  return await bcrypt.compare(candidatePassword, dbpassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpriresIn = Date.now() + 60 * 60 * 100;

  return resetToken;
};

const userModel = mongoose.model("user", userSchema);

export default userModel;
