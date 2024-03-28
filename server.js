const dotenv = require("dotenv");
dotenv.config();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const express = require("express");
const fs = require("fs");
const stripe = require("stripe")(stripeSecretKey);

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
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

app.post("/purchase", (req, res) => {
  const items = req.body.items;
  const stripeTokenId = req.body.stripeTokenId;

  fs.readFile("items.json", (err, data) => {
    if (err) {
      res.status(500).send("Error loading items");
    } else {
      const itemsJson = JSON.parse(data);
      const itemsArray = itemsJson.music.concat(itemsJson.merch);
      let total = 0;
      items.forEach((item) => {
        const itemJson = itemsArray.find(
          (i) => Number(i.id) === Number(item.id)
        );
        if (itemJson) {
          total += item.quantity * itemJson.price;
        }
      });
      stripe.charges
        .create({
          amount: total,
          source: stripeTokenId,
          currency: "usd",
        })
        .then((result) => {
          res.json({ success: true, message: "Successfully purchased items!" });
        })
        .catch((err) => {
          res.status(500).json({ success: false, message: err.message });
        });
    }
  });
});

// listen
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
