const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res) {

  const query = req.body.cityName;
  const apiKey = process.env.apiKey;
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&temperature.unit=Celsius&appid=" + apiKey + "&units=" + unit;

  https.get(url, function(response) {
    console.log(response.statusCode);

    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = Math.round(weatherData.main.temp);
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.write("<p style='text-align:center; padding-top:100px; text-transform: capitalize;'> " + weatherDescription + " </p>");
      res.write("<center> <h1 style='text-transform: capitalize;'> the temperature in " + query + " is " + temp + " degrees celsius </h1> </center>");
      res.write("<center> <img src = " + imageURL + " > </center>");
      
      res.send();
    })
  })
})

app.listen(3000, function() {
  console.log("Server running on port 3000");
})