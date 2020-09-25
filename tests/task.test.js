const request = require("supertest");
const app = require("../src/app");

const { userOne, setUpDatabase, userTwo } = require("./fixtures/db");

beforeEach(setUpDatabase);

test("Should create a new task", async () => {
  await request(app)
    .post("/newtask")
    .set("Authorization", `Bearer ${userOne.tokens[0].authToken}`)
    .send({
      description: "Sample task",
    })
    .expect(201);
});

test("Should fetch tasks associated to a user", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].authToken}`)
    .expect(200);

  expect(response.body.length).toEqual(2);
});

//
// Task Test Ideas
//
//
// Should not delete another user task
// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks
