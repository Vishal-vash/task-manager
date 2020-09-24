const express = require("express");
const Task = require("../models/task");

const auth = require("../middlewares/auth");

const router = new express.Router();

router.post("/newtask", auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id });

  try {
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if(req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  if(req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
  }
  try {
    //const tasks = await Task.find({owner: req.user._id});
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: +req.query.limit,
        skip: +req.query.skip,
        sort
      }
    }).execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(404).send({});
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({_id, owner: req.user._id});
    if (!task) return res.status(404).send({});
    res.send(task);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const bodyUpdates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isUpdateAllowed = bodyUpdates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isUpdateAllowed)
    return res.status(400).send({ error: "Invalid updates provided." });

  try {
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
    if (!task) return res.status(404).send({});

    bodyUpdates.forEach(update => task[update] = req.body[update]);
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
    if (!task) return res.status(404).send({ error: "Task not found." });

    await task.remove();
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
