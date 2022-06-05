const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoute");
const sauceRouter = require("./routes/sauceRoute");
const path = require("path");

//  connecter la database mongoDB
mongoose
  .connect(
    "mongodb+srv://houssinp6OC:houssinp6OC@cluster0.8wv3t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !!!"));

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRouter);
app.use("/api/sauces", sauceRouter);
module.exports = app;
