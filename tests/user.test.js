const request = require("supertest");

const { userOne, setUpDatabase } = require("./fixtures/db");
const app = require("../src/app");
const User = require("../src/models/user");

beforeEach(setUpDatabase);

test("Should sign up a new user", async () => {
  await request(app)
    .post("/newuser")
    .send({
      name: "Vishal-test",
      email: "test@test.com",
      password: "testing123",
    })
    .expect(201);
});

test("Should login existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
});

test("Should not login non existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "bademail",
      password: userOne.password,
    })
    .expect(400);
});

test("Should get the profile of logged in user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].authToken}`)
    .expect(200);
});

test("Should not get the profile of unauthenticated user", async () => {
  await request(app).get("/users/me").expect(401);
});

test("Should delete account for authenticated user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].authToken}`)
    .expect(200);
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me").expect(401);
});

test("Should upload avatar image for user", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].authToken}`)
    .attach("avatar", "tests/fixtures/avatar-2.jpg")
    .expect(200);

  const user = await User.findById(userOne._id);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should not signup user with invalid name/email/password", async () => {
  await request(app)
    .post("/newuser")
    .send({
      name: 123,
      email: "testing@test.com",
      password: 321,
    })
    .expect(400);
});

test("Should update user if authenticated", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].authToken}`)
    .send({
      name: "Vishal V",
    })
    .expect(200);

  const user = await User.findById(userOne._id);
  expect(user.name).toEqual("Vishal V");
});

test("Should not update user if authenticated", async () => {
  await request(app)
    .patch("/users/me")
    .send({
      name: "Vishal V",
    })
    .expect(401);
});

test("Should not update user with invalid name/email/password", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].authToken}`)
    .send({
      name: 'Something',
      email: 'test@test.com',
      password: 123
    })
    .expect(400)
});
