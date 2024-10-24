# Weather Application Using Yr API

This weather application fetches real-time weather data from the Yr API and displays the current weather information, including temperature, wind speed, precipitation, and the current UTC time. The weather data dynamically updates as the user moves an icon (marker) on a map to different locations.

## Features

- **Weather Data:** Displays temperature, wind speed, and precipitation data for the current location.
- **UTC Time:** Shows the time of the weather forecast in UTC.
- **Dynamic Weather Updates:** The weather data updates when the user moves the marker to a new location on the map.
- **Map Integration:** Allows users to interact with a map and retrieve real-time weather data by moving an icon.
- **Yr API Integration:** Fetches real-time weather data from the Yr API (https://api.met.no/).

## Live Demo

You can view the live version of this project here:

[Live Demo on GitHub Pages](https://saidxyz.github.io/im-interactive-in-a-world-weather-api/)

## How It Works

1. **Map Integration**: Users can drag the marker on the map to select any location.
2. **Weather Data**: The application fetches weather data from the Yr API based on the marker's position (latitude and longitude).
3. **Display Weather**: The fetched data is displayed on the page, including temperature, wind speed, precipitation, and the forecast UTC time.
4. **Live Updates**: Every time the marker is moved, the weather data automatically updates based on the new location.

## Installation (For Local Development)

If you would like to run the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/saidxyz/im-interactive-in-a-world-weather-api.git
   cd im-interactive-in-a-world-weather-api
