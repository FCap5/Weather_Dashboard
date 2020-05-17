var apiKey = "5bebca8631f3a47838f962d8cbffa4a6";

//check local storage for city history
var citiesFromLS = localStorage.getItem("cityHistory");
//if no history, do nothing
if (citiesFromLS == null) {
  //else split city history by comma
} else {
  var citySplit = citiesFromLS.split(",");
  //find the index last item in the array of strings
  var recentSearch = citySplit.length - 1;
  //set that item as cityName
  cityName = citySplit[recentSearch];
  //loop through array and set the history as search buttons
  recentSearchLoop();
  //run api to search for most recently searched city upon loading page
  runAPI();
}
//finds the ten most recenty searched cities
function recentSearchLoop() {
  if (citySplit.length <= 10) {
    for (i = 0; i < citySplit.length; i++) {
      addRecentSearch();
    }
  } else {
    for (i = citySplit.length - 10; i < citySplit.length; i++) {
      addRecentSearch();
    }
  }
}
//adds search history buttons
function addRecentSearch() {
  //https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
  var nameCapitalized =
    citySplit[i].charAt(0).toUpperCase() + citySplit[i].slice(1);
  var recentCity = $("<div>")
    .text(nameCapitalized)
    .css({
      border: "1px solid #c2bfbf",
      height: "40px",
      fontSize: "15px",
      textAlign: "center",
      borderRadius: "0",
    })
    .attr({ class: "btn col-sm-11 historyBtn" });
  $("#searchHistory").prepend(recentCity);
}
//search button event listener
$("#searchBtn").click(function () {
  //sets cityName to search value
  cityName = $("#search").val();
  clickyClicky();
});

$(".historyBtn").on("click", function () {
  //sets cityName to value of button clicked
  cityName = $(this).html();

  clickyClicky();
});

//reloads page so that history and current search update
function clickyClicky() {
  location.reload();
  runAPI();

  //updating
  var cityArray = [];
  var cityLS = localStorage.getItem("cityHistory");

  if (cityLS == null) {
    cityArray.push(cityName);
    localStorage.setItem("cityHistory", cityArray);
  } else {
    //if cityName != name in database{
    //return error
    //}else if cityName already used dont append
    //else{
    cityArray.push(cityLS);
    cityArray.push(cityName);
    localStorage.setItem("cityHistory", cityArray);
  }
}

function runAPI() {
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    //https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_tofixed3 - to fixed
    var curentTemp = ((response.main.temp * 9) / 5 - 459.67).toFixed(1);
    var iconCode = response.weather[0].icon;
    var iconURL = `https://openweathermap.org/img/wn/${iconCode}.png`;
    $("#cityName").text(response.name + " (" + moment().format("L") + ")");
    $("#icon").attr("src", iconURL).css({});
    //http://www.javascripter.net/faq/mathsymbols.htm - degree sign
    $("#temp").text("Temperature: " + curentTemp + "\xB0" + "F");
    $("#wind").text("Wind Speed: " + response.wind.speed + " M.P.H");
    $("#humidity").text("Humidity: " + response.main.humidity + "%");
    //cityName = JSON.stringify(response.name);

    //getting UV - only available in onecall
    var lat = response.coord.lat;
    var lon = response.coord.lon;
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`,
      method: "GET",
    }).then(function (response) {
      //setting text
      $("#uvIndex")
        .text("UV Index: ")
        .append($("<span>").text(response.current.uvi));
      //setting color
      if (response.current.uvi <= 3) {
        $("#uvIndex span").css({ backgroundColor: "green", width: "100%" });
      } else if (response.current.uvi > 3 && response.current.uvi <= 7) {
        $("#uvIndex span").css({ backgroundColor: "yellow", width: "100%" });
      } else if (response.current.uvi > 7) {
        $("#uvIndex span").css({ backgroundColor: "red", width: "100%" });
      }
    });
  });
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`,
    method: "GET",
  }).then(function (response) {
    //for (i=0; i<)
    //for each of five days, create a card
    $("#fiveDayForecast").text("");
    for (i = 0; i < 5; i++) {
      var date = moment()
        .add(i + 1, "days")
        .format("MM" + "/" + "DD" + "/" + "YYYY");
      var iconCode = response.list[i].weather[0].icon;
      var iconURL = `https://openweathermap.org/img/wn/${iconCode}.png`;
      var dayCard = $("<div>")
        .css({
          backgroundColor: "#156ed4",
          height: "100%",
          width: "400px",
          margin: "2px",
          paddingLeft: "3px",
          color: "white",
        })
        .attr({ class: "col-md-12 col-lg-2 rounded" });
      var cardDate = $("<p>")
        .append(date)
        .css({ fontSize: "20px", fontWeight: "bolder" });
      var logoDiv = $("<img>").attr("src", iconURL);
      var dayTemp = ((response.list[i].main.temp * 9) / 5 - 459.67).toFixed(2);
      var tempP = $("<p>").text("Temp: " + dayTemp + "\xB0" + "F");
      var humidityP = $("<p>").text(
        "Humidity: " + response.list[i].main.humidity + "%"
      );
      $(dayCard).append(cardDate, logoDiv, tempP, humidityP);
      $("#fiveDayForecast").append(dayCard);
    }
  });
}
