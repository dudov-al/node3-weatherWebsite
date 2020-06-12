const request = require("request");

const forecast = (lat, long, callback) => {
  const url =
    "https://api.darksky.net/forecast/e6af5b5feb891b272e18f5e2fc0370a6/" +
    lat +
    "," +
    long +
    "?units=si";
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to server", undefined);
    } else if (body.error) {
      callback("Unable to find location", undefined);
    } else {
      callback(
        undefined,
        body.daily.summary +
          " It is currently " +
          body.currently.temperature +
          " with max temperature " +
          body.daily.data[0].temperatureHigh +
          " and low temperature " +
          body.daily.data[0].temperatureLow + ". There is " + body.currently.precipProbability + "% probability of precipitation today"
      );
    }
  });
};

module.exports = forecast;
