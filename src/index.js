const express = require("express");
require("./db/mongoose");
const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

//Start the Server
app.listen(PORT, () => console.log(`Server started and running at ${PORT}`));
