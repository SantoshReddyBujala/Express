const express = require("express");
const path = require("path");
const { logger } = require("./middleware/logEvents");
const errorHangler = require("./middleware/errorHangler");
const corsOptions = require("./config/corsOptions");
const cors = require("cors");
const { error } = require("console");
const cookieParser = require("cookie-parser");
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require("./middleware/credentials");
const app = express();

const PORT = process.env.PORT || 3500;

app.use(credentials);

app.use(cors(corsOptions));

//custom middle ware
app.use(logger);

// built-in middle ware
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//Serve static files
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/subdir", express.static(path.join(__dirname, "/public")));
app.use("/employee", express.static(path.join(__dirname, "/public")));

//serve routes
app.use("/", require("./routers/root"));
app.use("/subdir", require("./routers/subdir"));
app.use("/register", require("./routers/register"));
app.use("/auth", require("./routers/auth"));
app.use("/refresh", require("./routers/refresh"));
app.use("/logout", require("./routers/logout"));

app.use(verifyJWT);
app.use("/employees", require("./routers/api/employees"));

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
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("text").send("404 Not Found");
  }
});

app.use(errorHangler);
app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
