var apiKey = "5bebca8631f3a47838f962d8cbffa4a6";
var citySearch = "";
var cityName = "Portland";
var stateName = "Maine";
var countryCode = "US";
var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${stateName},${countryCode}&appid=${apiKey}`;

$.ajax({
  url: queryURL,
  method: "GET",
}).then(function (response) {
  $("#searchButton").click(function () {
    cityName = $("#searchP").val();
    console.log(cityName);
  });
  console.log(response);
  //https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_tofixed3 - to fixed
  var curentTemp = ((response.main.temp * 9) / 5 - 459.67).toFixed(1);
  $("#cityName").text(response.name + ", " + stateName + " ");
  //http://www.javascripter.net/faq/mathsymbols.htm - degree sign
  $("#temp").text("Temperature: " + curentTemp + "\xB0" + "F");
  $("#wind").text("Wind Speed: " + response.wind.speed + " M.P.H");
  $("#humidity").text("Humidity: " + response.main.humidity + "%");
  $("#uvIndex").text("UV Index:");
});
