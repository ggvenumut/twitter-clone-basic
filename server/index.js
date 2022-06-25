const express = require("express");
const cors = require("cors");
const monk = require("monk");
const rateLimit = require("express-rate-limit");
const Filter = require("bad-words");

const app = express();
const port = process.env.PORT || 9000;

const db = monk(process.env.MONGO_URI || "localhost/twitterCloneBasic");
const twit = db.get("twit");

const filter = new Filter();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "hello world ",
  });
});
app.get("/data", (req, res) => {
  twit.find().then((twit) => {
    res.json(twit);
  });
});

function isValidData(data) {
  return (
    data.content &&
    data.content.toString().trim() !== "" &&
    data.name &&
    data.name.toString().trim() !== ""
  );
}
app.use(
  rateLimit({
    windowMs: 1 * 10 * 1000, // 15 minutes
    max: 1, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  })
);
app.post("/data", (req, res) => {
  if (isValidData(req.body)) {
    // insert into db...
    const data = {
      name: filter.clean(req.body.name.toString()),
      content: filter.clean(req.body.content.toString()),
      created: new Date(),
    };

    twit.insert(data).then((createdTwit) => {
      res.json(createdTwit);
    });
  } else {
    res.status(422).json({
      message: "Hey! Name and Content are required!",
    });
  }
});

app.listen(5000, () => {
  console.log("listening on 5000");
});
