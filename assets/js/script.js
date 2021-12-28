// API Key -  64e2cba491f5c7c9e42caa6e15bbc619
// Global Variables
var apiKey = "64e2cba491f5c7c9e42caa6e15bbc619";
var today = moment().format('L');
var searchHistoryList = [];

// Function to call current conditions
function currentCondition(city) {
    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}';

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(cityWeatherResponse) {
        console.log(cityWeatherResponse);


    })
}

// Event Listener for Search Button
$("#searchBtn").on("click", function(event) {
    event.preventDefault();

    var city = $("#enterCity").val().trim();
    currentCondition(city);
    if (!searchHistoryList.includes(city)) {
        searchHistoryList.push(city);
        var searchedCity = $('<li class="list-group-item">${city}</li>');
        $("#searchHistory").append(searchedCity);
    };

    localStorage.setItem("city", JSON.stringify(searchHistoryList));
    console.log(searchHistoryList);
});