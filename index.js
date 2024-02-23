const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logEvents");
const errorHangler = require("./middleware/errorHangler");
const cors = require("cors");
const { error } = require("console");
const PORT = process.env.PORT || 3500;

//Cross origin resource sharing
const whitelist = [
  "https://www.google.com/",
  "http://localhost:3500",
  "http://127.0.1:5500",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed by CROS"));
    }
  },
  OptionSuccessStatus: 200,
};
app.use(cors(corsOptions));

//custom middle ware
app.use(logger);

// built-in middle ware
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(express.static(path.join(__dirname, "/public")));

app.get("^/$|index(.html)?", (req, res) => {
  //res.sendFile("./views/index.html", {root: __dirname});
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html"); //302 by default
});

//Router handlers
app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("attempted to load hello.html");
    next();
  },
  (req, res) => {
    res.send("Hello World");
  }
);

//Chaining route handlers
const one = (req, res, next) => {
  console.log("One");
  next();
};

const two = (req, res, next) => {
  console.log("Two");
  next();
};

const three = (req, res) => {
  console.log("Three");
  res.send("Finished!");
};

app.get("/chain(.html)?", [one, two, three]);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  }else  if (req.accepts("json")) {
    res.json({error: '404 Not Found'});
  }else{
    res.type('text').send('404 Not Found')
  }
});

app.use(errorHangler);
app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
