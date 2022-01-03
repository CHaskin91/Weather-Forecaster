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
        var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;
    
        var currentCity = $(`
            <h2 id="currentCity">
                ${cityWeatherResponse.name} ${today} <img src="${iconURL}" alt="${cityWeatherResponse.weather[0].description}" />
                </h2>
                <p>Temperature: ${cityWeatherResponse.main.temp} °F</p>
                <p>Humidity: ${cityWeatherResponse.main.humdity}\%</p>
                <p>Wind Speed: ${cityWeatherResponse.wind.speed} MPH</p>
                `);

        $("#cityDetail").append(currentCity);

        // UV Index
        var lat = cityWeatherResponse.coord.lat;
        var lon = cityWeatherResponse.coord.lon;
        var uviQueryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        $.ajax({
            url: uviQueryURL,
            method: "GET"
        }).then(function(uviResponse) {
            console.log(uviResponse);

            var uvIndex = uviResponse.value;
            var uvIndexP = $(`
                <p>UV Index:
                    <span id="uvIndexColor" class="px-2 py-2 rounded">${uvIndex}</span>
                </p>
            `);

            $("#cityDetail").append(uvIndexP);

            futureCondition(lat, lon);

            // UV Index Color Scale
        })    })
}

//Function for Future Condition
function futureCondition(lat, lon) {

    // 5 Day Forecast
    var futureURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;

    $.ajax({
        url: futureURL,
        method: "GET"
    }).then(function(futureResponse) {
        console.log(futureResponse);
        $("#fiveDay").empty();

        for (let i = 1; i < 6; i++) {
            var cityInfo = {
                date: futureResponse.daily[i].dt,
                icon: futureResponse.daily[i].weather[0].icon,
                temp: futureResponse.daily[i].temp.day,
                humidity: futureResponse.daily[i].humidity
            };

            var currDate = moment.unix(cityInfo.date).format("MM/DD/YYYY");
            var iconURL = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png" alt="${futureResponse.daily[i].weather[0].main}" />`;
        
            // Display Date, Weather Icons, Temp, and Humidity
            var futureCard = $(`
                <div class="pl-3">
                    <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem;>
                        <div class="card-body">
                            <h5>${currDate}</h5>
                            <p>${iconURL}</p>
                            <p>Temp: ${cityInfo.temp} °F</p>
                            <p>Humidity: ${cityInfo.humidity}\%</p>
                        </div>
                    </div>
                <div>
            `);

            $("#fiveDay").append(futureCard);
        }
    });
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