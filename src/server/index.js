const express = require("express");
const fileUpload = require("express-fileupload");
const os = require("os");
const path = require("path");
const sequelize = require("sequelize");
const cors = require("cors");

const bodyParser = require("body-parser");

const app = express();

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("dist"));

app.set("view engine", "ejs");
app.listen(3001, () => console.log("Listening on port 4000!"));

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/../../dist/index.html"), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

module.exports = app;
