// API Key -  64e2cba491f5c7c9e42caa6e15bbc619
// Global Variables
var apiKey = "64e2cba491f5c7c9e42caa6e15bbc619";
var today = moment().format('L');
var searchHistoryList = [];

// Function to call current conditions
function currentCondition(city) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(cityWeatherResponse) {
        console.log(cityWeatherResponse);

        $("#weatherContent").css("display", "block");
        $("#cityDetail").empty();

        var iconCode = cityWeatherResponse.weather[0].icon;
        var iconURL = 'https://openweathermap.org/img/w/${iconCode}.png';
    
        var currentCity = $(`
            <h2 id="currentCity">
                ${cityweatherResponse.name} ${today} <img src="${iconURL}" alt="${cityWeatherResponse.weather[0].description}" />
                </h2>
                <p>Temperature: ${cityWeatherResponse.main.temp} °F</p>
                <p>Humidity: ${cityWeatherResponse.main.humdity}\%</p>
                <p>Wind Speed: ${cityWeatherResponse.wind.speed} MPH</p>
                `);

        $("#cityDetail").append(currentCity);

        // UV Index

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