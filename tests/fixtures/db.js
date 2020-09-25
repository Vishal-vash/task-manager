const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const _id = new mongoose.Types.ObjectId();
const userOne = {
  _id,
  name: "Sam-test",
  email: "test@test2.com",
  password: "testing234",
  tokens: [{ authToken: jwt.sign({ _id }, process.env.SECRET_KEY) }],
};

const _id2 = new mongoose.Types.ObjectId();
const userTwo = {
  _id: _id2,
  name: "Vish-test",
  email: "test@test3.com",
  password: "testing345",
  tokens: [{ authToken: jwt.sign({ _id: _id2 }, process.env.SECRET_KEY) }],
};

const Task1 = {
  description: "This is task 1",
  owner: _id
}

const Task2 = {
  description: "This is task 2",
  owner: _id
}

const Task3 = {
  description: "This is task 3",
  owner: _id2
}

const setUpDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(Task1).save();
  await new Task(Task2).save();
  await new Task(Task3).save();
};

module.exports = {
    userOne,
    userTwo,
    setUpDatabase
}