var apiKey = "41280270b8405476d6049371a0bccdd1";

//onpage startup, execute these two functions
getHistory();
runAPI();

function getHistory() {
  //check local storage for city history
  var citiesFromLS = localStorage.getItem("cityHistory");
  //if no history, do nothing
  if (citiesFromLS == null) {
    //else split city history by comma
  } else {
    var citySplit = citiesFromLS.split(",");
    localStorage.setItem("citySplit", citySplit);
    //find the index last item in the array of strings
    var recentSearch = citySplit.length - 1;
    //set that item as cityName
    cityName = citySplit[recentSearch];
    //loop through array and set the history as search buttons
    recentSearchLoop();
    //run api to search for most recently searched city upon loading page
    //runAPI();
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
}
//adds search history buttons
function addRecentSearch() {
  var citySplitOne = localStorage.getItem("citySplit");
  var citySplitTwo = citySplitOne.split(",");
  //https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
  var recentCity = $("<div>")
    .text(citySplitTwo[i])
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

//event listener for if a city from history is selected
$(".historyBtn").on("click", function () {
  //sets cityName to value of button clicked
  cityName = $(this).html();
  runAPI();
  //after API is complete, reload page
  //https://api.jquery.com/ajaxcomplete/
  $(document).ajaxComplete(function () {
    location.reload();
  });
});

//event listener for search button
$("#searchBtn").click(function () {
  cityName = $("#search").val();
  $("#search").val("");
  runAPI();
  $(document).ajaxComplete(function () {
    location.reload();
  });
});

//function that runs ajax calls
function runAPI() {
  //ajax call one gets city name, weather icon, temp, wind, and humidity
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

    //setting items from the ajax call to local storage so they can be
    //accessed by other functions outside the ajax call
    var cityArray = [];
    var cityLS = localStorage.getItem("cityHistory");
    var newCityName = response.name;
    var cityArrayLS = [];

    //if the user has yet to search for a city
    if (cityLS == null) {
      cityArray.push(newCityName);
      localStorage.setItem("cityHistory", cityArray);

      //if the user has already searched for a city
    } else {
      var cityLSSplit = cityLS.split(",");
      //if the user has only searched for one city
      //needed this because the split function would otherwise return a comma, which
      //would then return a blank button in the city history field
      if (cityLSSplit.length == 1) {
        if (newCityName == cityLSSplit[0]) {
        } else {
          cityArrayLS.push(cityLSSplit);
          localStorage.setItem("cityHistory", cityArrayLS);
        }
        //otherwise, it'll loop through the ten most recent searches to see if there are any repeats
        //if there are, it'll splice the first instance by its index so that the new instance can be
        //prepended to the history without repeat
      } else {
        if (cityLSSplit.length <= 10) {
          for (i = 0; i < cityLSSplit.length; i++) {
            if (newCityName == cityLSSplit[i]) {
              cityLSSplit.splice(i, 1);
            }
          }
        } else {
          for (i = cityLSSplit.length - 10; i < cityLSSplit.length; i++) {
            if (newCityName == cityLSSplit[i]) {
              cityLSSplit.splice(i, 1);
            }
          }
        }
        cityArrayLS.push(cityLSSplit);
      }
    }
    cityArrayLS.push(newCityName);
    localStorage.setItem("cityHistory", cityArrayLS);

    //var lat and lon needed for next ajax call
    var lat = response.coord.lat;
    var lon = response.coord.lon;

    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`,
      method: "GET",
    }).then(function (response) {
      console.log(response);
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
