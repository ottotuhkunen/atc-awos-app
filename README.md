# Weather display for Flight Simulation purposes

This Web Application displays weather information useful for air traffic controllers connected to VATSIM network.

- Access for VATSIM members with an S1 rating or higher

## Features

- Login with OAuth2 Authentication
- Helsinki weather display
  - Main weather display with wind data, pressure (hPa), transition level (TRL), ATC tactical messages and Meteorological Conditions Indicator (VMC/IMC/LVP)
  - Runway Conditions Views with runway condition codes (RCC), contaminants and comments
  - SNOWTAM page with winter conditions for runways, taxiways and aprons
  - MET REPORT page with the current MET REPORT and METAR's / TAF's for nearby airports
  - Setup page containing runway selection (automatic), list of registered ATS-units and tactical messages setup
- AWOS for regional aerodromes
  - Airfield View with current weather information (wind, visibility, weather, clouds, temperature, dewpoint etc.)
  - Chart Display showing graphs of recent data from the past few hours
  - Latest METARs page showing latest 20 METAR's for the selected aerodrome
  - Screen Cleaning page allows the user to clean the touch screen more easily

## Technologies

- Client side is simple HTML+CSS
- Drawings (runways etc.) are made with SVG
- Postgre SQL is used as the database serving this app
- Server consists of Node js Express
- App is published on Heroku

## Todo

- I started to develop this app when I had less knowledge of coding and the different technologies used. There is a lot of room for improvements in the code and functionalities. Improvements are being made when the time allows.