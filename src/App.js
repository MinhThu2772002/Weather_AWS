import React, { useState } from "react";
import "bulma/css/bulma.min.css";
import "./App.css";
import axios from "axios";
const API_GATEWAY_ENDPOINT =
  "https://r3ijvpedwf.execute-api.eu-north-1.amazonaws.com/dev";

function App() {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const API_KEY = "d9f99186e33699af6278171c51e3d418";

  const getWeatherData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    getWeatherData();
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data);
        handleSaveWeather(location, data);
        const weatherCondition = data.weather[0].main.toLowerCase();
        document.body.className = weatherCondition;
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };
  const handleSaveWeather = (location, data) => {
    if (data) {
      // Call the AWS Lambda function to save the weather search data
      fetch(API_GATEWAY_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
          operation: "saveSearchData",
          location: location,
          weatherData: data,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    }
  };
  const handleGetRecentSearchesClick = async () => {
    try {
      const response = await axios.post(
        "https://r3ijvpedwf.execute-api.eu-north-1.amazonaws.com/dev",
        {
          operation: "getRecentSearches",
        }
      );
      setRecentSearches(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div class="App">
      <section class="hero is-primary">
        <div class="hero-body">
          <h1 class="title is-3 has-text-centered has-text-white">
            <span class="title is-3 has-text-centered has-text-white">
              Weather App{" "}
            </span>{" "}
            <br />
            <span class="subtitle is-5 has-text-grey">
              Created by Thu Nguyen Quoc Minh{" "}
            </span>{" "}
          </h1>{" "}
        </div>{" "}
      </section>{" "}
      <section class="section">
        <div class="container">
          <form onSubmit={handleSubmit}>
            <div class="field">
              <label class="label"> Enter location: </label>{" "}
              <div class="control">
                <input
                  class="input is-primary is-rounded"
                  type="text"
                  value={location}
                  onChange={handleLocationChange}
                />{" "}
              </div>{" "}
            </div>{" "}
            <div class="field">
              <div class="control">
                <button class="button is-primary" type="submit">
                  Get Weather{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
          </form>{" "}
          {weatherData && (
            <div class="weather-data-container">
              <h2 class="weather-data-heading">
                {" "}
                {weatherData.name}, {weatherData.sys.country}{" "}
              </h2>{" "}
              <div class="current-weather-container">
                <div class="temperature-container">
                  <p class="temperature">
                    {" "}
                    {Math.round(weatherData.main.temp)}° C{" "}
                  </p>{" "}
                  <p class="feels-like">
                    Feels like: {Math.round(weatherData.main.feels_like)}° C{" "}
                  </p>{" "}
                </div>{" "}
                <div class="weather-description-container">
                  <img
                    src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                    alt={weatherData.weather[0].description}
                    class="weather-icon"
                  />
                  <p class="weather-description">
                    {" "}
                    {weatherData.weather[0].description}{" "}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <div class="additional-info-container">
                <div class="weather-info-container">
                  <div class="notification is-info">
                    <p class="weather-info">
                      Humidity: {weatherData.main.humidity} %
                    </p>{" "}
                  </div>{" "}
                  <div class="notification is-info">
                    <p class="weather-info">
                      Wind: {Math.round(weatherData.wind.speed)}m / s{" "}
                    </p>{" "}
                  </div>{" "}
                  <div class="notification is-info">
                    <p class="weather-info">
                      Visibility: {Math.round(weatherData.visibility / 1000)}
                      km{" "}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <div class="sun-info-container">
                  <div class="notification is-warning">
                    <p class="sun-info">
                      Sunrise:{" "}
                      {formatDate(new Date(weatherData.sys.sunrise * 1000))}{" "}
                    </p>{" "}
                  </div>{" "}
                  <div class="notification is-warning">
                    <p class="sun-info">
                      Sunset:{" "}
                      {formatDate(new Date(weatherData.sys.sunset * 1000))}{" "}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          )}{" "}
        </div>{" "}
      </section>{" "}
      <div class="has-text-centered">
        <button
          class="button is-primary"
          onClick={handleGetRecentSearchesClick}
        >
          Get Recent Searches{" "}
        </button>{" "}
        <section class="section">
          {" "}
          {recentSearches.length > 0 && (
            <div class="recent-searches-container has-text-centered">
              <div class="recent-searches">
                <table class="table is-striped is-centered">
                  <thead>
                    <tr>
                      <th> Location </th> <th> Date </th>{" "}
                    </tr>{" "}
                  </thead>{" "}
                  <tbody>
                    {" "}
                    {recentSearches.map((search, index) => (
                      <tr key={index}>
                        <td> {search.location} </td>{" "}
                        <td> {search.searchDate} </td>{" "}
                      </tr>
                    ))}{" "}
                  </tbody>{" "}
                </table>{" "}
              </div>{" "}
            </div>
          )}{" "}
        </section>{" "}
      </div>{" "}
    </div>
  );
}

export default App;
