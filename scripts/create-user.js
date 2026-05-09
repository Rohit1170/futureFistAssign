const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI =
  "mongodb+srv://rohit1170be20_db_user:9kD9ZwcVn7qwPuzy@cluster0.jwp6ppn.mongodb.net/?appName=Cluster0";

async function main() {
  await mongoose.connect(MONGODB_URI);

  const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: String,
  });

  const User = mongoose.model("User", userSchema);

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const existing = await User.findOne({
    email: "admin@example.com",
  });

  if (existing) {
    console.log("User already exists");
    process.exit(0);
  }

  await User.create({
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin",
  });

  console.log("Demo user created");

  process.exit(0);
}

main();