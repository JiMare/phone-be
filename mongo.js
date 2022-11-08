const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://JitkaM:${password}@cluster0.ut62wj5.mongodb.net/phoneBookApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  mongoose.connect(url).then((result) => {
    console.log("connected");
    Person.find({}).then((result) => {
      console.log("phonebook:");
      result.forEach((person) =>
        console.log(`${person.name} ${person.number}`)
      );
      return mongoose.connection.close();
    });
  });
} else {
  mongoose
    .connect(url)
    .then((result) => {
      console.log("connected");

      const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
      });
      return person.save();
    })
    .then((result) => {
      console.log(`added ${result.name} number ${result.number} to phonebook`);
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
}
