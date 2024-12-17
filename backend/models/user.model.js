import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    validate: {
      validator: function (value) {
        return emailRegexPattern.test(value);
      },
      message: "Please enter a valid email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  role: {
    type: String,
    enum: ["examinee", "admin"],
    default: "examinee",
    required: true,
  },
  licenseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "License",
  },
  favoriteId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
    },
  ],
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Sign Access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.ACCESS_TOKEN || "",
    { expiresIn: "5m" }
  );
};

// Sign Refresh token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.REFRESH_TOKEN || "",
    {
      expiresIn: "3d",
    }
  );
};

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
