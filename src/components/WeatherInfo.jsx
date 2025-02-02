import { Box, Typography } from "@mui/material";
import { getWindDirectionInSpanish } from "../utils/getWindDirectionInSpanish";

export default function WeatherInfo({ weather }) {
  const windDirection = getWindDirectionInSpanish(weather.wind_dir);

  return (
    <Box sx={{ mt: 2, display: "grid", gap: 2, textAlign: "center" }}>
      <Typography variant="h4" component="h2">
        {weather.city}, {weather.country}
      </Typography>
      <Box component="img" alt={weather.conditionText} src={weather.icon} sx={{ margin: "0 auto" }} />
      <Typography variant="h5" component="h3">
        {weather.temp} ºC
      </Typography>
      <Typography variant="h6" component="h4">
        {weather.conditionText}
      </Typography>
      <Typography>Humedad: {weather.humidity}%</Typography>
      <Typography>
        Viento: {weather.wind_kph} km/h {windDirection.icon} {windDirection.text}
      </Typography>
      <Typography>Sensación térmica: {weather.feelslike_c} ºC</Typography>
    </Box>
  );
}