const path = require("path");
const express = require("express");
const geoCode = require("./utils/geocode");
const forecast = require("./utils/forecast.js");

const hbs = require("hbs");
//const forecast = require("../../Weather-app/utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDir = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views"); //путь к кастомной директории для HBS (потому что ищет views по умолчанию)
const partialsPath = path.join(__dirname, "../templates/partials/");

//Setup HBS engine and Views location
app.set("view engine", "hbs"); //set value for Express
app.set("views", viewsPath); //указываем на новую директорию
hbs.registerPartials(partialsPath); // подключаем детали для HBS (папку откуда будет брать)

//Setup static directore to serve
app.use(express.static(publicDir));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Alex",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me page",
    name: "Alex",
  });
});
app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "Help page",
    name: "Alex",
    title: "Help page",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Provide valid address",
    });
  }
  geoCode(
    req.query.address,
    (error, { latitude, longtitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longtitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          address: req.query.address,
          location,
          forecast: forecastData,
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      //защита от двойной отправки
      error: "You must provide search",
    });
  }
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    message: "Help link not found",
    title: "Help links",
    name: "Alex",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    message: "Page not found",
    title: "Page link",
    name: "Alex",
  });
});

app.listen(port, () => {
  console.log("Server is up on " + port);
});
