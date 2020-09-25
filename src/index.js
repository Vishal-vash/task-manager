const app = require("./app");

const PORT = process.env.PORT;

//Start the Server
app.listen(PORT, () => console.log(`Server started and running at ${PORT}`));
