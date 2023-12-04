require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/user");
const Location = require("./models/location");
const bcrypt = require("bcrypt");

//console.log(`${process.env.DATABASE}`);

//const DB = `mongodb://admin:!GLORYBE2GOD@mongo:27018/DSC_Client_Database`;
//DATABASE=mongodb://localhost:27017/DSC_Client_Database

const DB = `mongodb://admin3:GloryToGod123@mongo:27018/DSC_Client_Database`;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DATABASE CONNECTED"))
  .catch(() => console.log("DATABASE CONNECTION ERROR"));
// Define user and location data
const users = [
  {
    name: "admin",
    email: "admin@dsc.com",
    password: "admin@dsc.com",
    role: "admin",
  },
  {
    name: "staff",
    email: "staff@dsc.com",
    password: "staff@dsc.com",
    role: "user",
  },
];

const locations = [
  {
    country: "Cameroon",
    region: "Littoral",
    city: "Douala",
  },
  {
    country: "Cameroon",
    region: "Center",
    city: "Yaounde",
  },
  {
    country: "Cameroon",
    region: "South West",
    city: "Buea",
  },
];

// Hash the passwords before inserting into the database
async function hashPasswords(data) {
  const hashedData = [];
  for (const item of data) {
    const hashedPassword = await hashPassword(item.password);
    hashedData.push({ ...item, password: hashedPassword });
  }
  return hashedData;
}

// Hash the password using bcrypt with a salt factor of 12
function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
}

// Seed the data
async function seedData() {
  try {
    const hashedUsers = await hashPasswords(users);
    await User.insertMany(hashedUsers);
    await Location.insertMany(locations);
    console.log(
      "<<<<<< Data seeded successfully >>>>>> \n \n --------- \n",
      users,
      "\n \n ----- \n ",
      locations,
    );
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Call the seedData function
seedData();
