import React, { useEffect, useState } from 'react';
import './Weather.css';

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=-1.29&longitude=36.82&daily=temperature_2m_min,temperature_2m_max,precipitation_probability_mean,weathercode&current_weather=true&timezone=auto'
    )
      .then((res) => res.json())
      .then((data) => setWeatherData(data));

    const updateTime = () => {
      const now = new Date();
      const options = { weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: true };
      setCurrentTime(now.toLocaleString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!weatherData) return <div className="weather-container"><div className="weather-card">Loading...</div></div>;

  const { current_weather, daily } = weatherData;
  const days = ['Today', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'];

  // Determine weather condition based on weathercode
  const weatherCode = current_weather.weathercode;
  let condition = 'clear';

  if ([0, 1].includes(weatherCode)) {
    condition = 'sunny';
  } else if ([2, 3, 45, 48].includes(weatherCode)) {
    condition = 'cloudy';
  } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) {
    condition = 'rainy';
  }

  return (
    <div className="weather-container">
      {/* Conditional Weather Animations */}
      {condition === 'sunny' && <div className="sun"></div>}
      {condition === 'cloudy' && <div className="cloud"></div>}
      {condition === 'rainy' &&
        [...Array(20)].map((_, i) => (
          <div
            key={i}
            className="rain-drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random()}s`,
            }}
          ></div>
        ))}

      <div className="weather-card">
        <div className="header">
          <p className="time">{currentTime}</p>
          <h1 className="temperature">{condition.charAt(0).toUpperCase() + condition.slice(1)} {current_weather.temperature}°C</h1>
          <p className="location">Nairobi, Kenya</p>
        </div>

        <div className="sun-info">
          <span>6:26 am</span>
          <span>12 h 06 m</span>
          <span>6:32 pm</span>
        </div>

        <div className="rain">
          🌧 Rain: {daily.precipitation_probability_mean[0]}%
        </div>

        <div className="stats">
          <span>Humidity: 73%</span>
          <span>Wind: {current_weather.windspeed} km/h</span>
        </div>

        <div className="forecast">
          {days.map((day, index) => (
            <div className="forecast-day" key={index}>
              <div>☁️</div>
              <p>{day}</p>
              <p>{daily.temperature_2m_max[index]}° / {daily.temperature_2m_min[index]}°</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
