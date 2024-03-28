const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");

const app = express();
dotenv.config();

const stripeSecrecKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

app.set("view engine", "ejs");

app.use(express.static("public"));

// routes==========================
app.get("/store", (req, res) => {
  fs.readFile("items.json", (err, data) => {
    if (err) {
      res.status(500).send("Error loading items");
    } else {
      res.render("store.ejs", {
        stripePublicKey,
        items: JSON.parse(data),
      });
    }
  });
});

// listen
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
