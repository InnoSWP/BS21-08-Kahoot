const { Mongoose } = require("mongoose");
const user = require("./userModel");

test("Create a user", async () => {
  let testUser = new user({
    name: "test",
    email: "test@test.com",
    password: "testtest",
  });

  async function deleteAndCreateAnEntry(entry) {
    await user.deleteOne({ email: entry.email }, (err) => {
      if (err) reject("Error deleting an entry");
      else resolve();
    });

    entry.save((err) => {
      if (err) reject("Error saving an entry");
    });

    await user.find({ email: entry.email }, (err, person) => {
      if (err) reject("Error finding an entry");

      expect(person.name).toBe(entry.name);
      expect(person.email).toBe(entry.email);
      resolve();
    });
  }

  await deleteAndCreateAnEntry(testUser);
});
