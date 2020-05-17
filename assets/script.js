var apiKey = "5bebca8631f3a47838f962d8cbffa4a6";

var citySearch = "";
var countryCode = "US";

$("#searchBtn").click(function () {
  var cityName = $("#search").val();
  console.log(cityName);

  var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    //https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_tofixed3 - to fixed
    var curentTemp = ((response.main.temp * 9) / 5 - 459.67).toFixed(1);
    $("#cityName").text(response.name);
    //http://www.javascripter.net/faq/mathsymbols.htm - degree sign
    $("#temp").text("Temperature: " + curentTemp + "\xB0" + "F");
    $("#wind").text("Wind Speed: " + response.wind.speed + " M.P.H");
    $("#humidity").text("Humidity: " + response.main.humidity + "%");

    //getting UV - only available in
    var lat = response.coord.lat;
    var lon = response.coord.lon;
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`,
      method: "GET",
    }).then(function (response) {
      console.log(response.current.uvi);
      $("#uvIndex")
        .text("UV Index: ")
        .append($("<span>").text(response.current.uvi));
      if (response.current.uvi <= 3) {
        $("#uvIndex span").css({ backgroundColor: "green", width: "100%" });
      } else if (response.current.uvi > 3 && response.current.uvi <= 7) {
        $("#uvIndex span").css({ backgroundColor: "yellow", width: "100%" });
      } else if (response.current.uvi > 7) {
        $("#uvIndex span").css({ backgroundColor: "red", width: "100%" });
      }
    });
    $("#uvIndex").text("UV Index:");
  });
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`,
    method: "GET",
  }).then(function (response) {
    console.log(response);
  });
});
