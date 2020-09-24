const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    unique: true,
    validate(val) {
      if (!validator.isEmail(val)) throw new Error("Email is not valid.");
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    validate(val) {
      if (val.includes("password"))
        throw new Error("Password must not contain the word password.");
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(val) {
      if (val < 0) throw new Error("Age must be a positive number");
    },
  },
  tokens: [
    {
      authToken: {
        type: String,
        required: true,
      },
    },
  ],
  avatar: {
    type: Buffer
  }
}, {
    timestamps: true
});

//Adding auth token to the user instance
UserSchema.methods.generateToken = async function () {
  const user = this;

  const authToken = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY);
  user.tokens = user.tokens.concat({ authToken });

  await user.save();
  return authToken;
};

//Adding virtual fields
UserSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

//Restring to only return limited user information
UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

//Adding custom functions on user instance
UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password.");

  return user;
};

//Hashing the password before saving the user
UserSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

//Delete associated user tasks
UserSchema.pre("remove", async function(next) {
    const user = this;
    await Task.deleteMany({owner: user._id})
    next();
})

const User = mongoose.model("User", UserSchema);

module.exports = User;
