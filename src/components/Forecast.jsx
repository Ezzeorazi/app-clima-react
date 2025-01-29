import { Box, Card, CardContent, Typography } from "@mui/material";
import { getWindDirectionInSpanish } from "../utils/getWindDirectionInSpanish";

export default function Forecast({ forecast }) {
  // Función para obtener el nombre del día y la fecha
  const getDayAndDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("es-ES", options); // Formato: "Lunes, 10 de Noviembre de 2024"
  };

  // Obtener la siguiente hora completa
  const now = new Date();
  const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0);

  // Filtrar las horas a partir de la siguiente hora completa
  const next12Hours = forecast.hourly.filter(hour => new Date(hour.time) >= nextHour).slice(0, 12);

  return (
    <Box sx={{ display: "grid", gap: 2, mt: 3 }}>
      <Typography variant="h6" component="h4">Previsión del viento para las próximas 12 horas</Typography>
      {next12Hours.map((hour, index) => (
        <Card key={index} sx={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
          <CardContent>
            <Typography variant="body2">
              {new Date(hour.time).toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' })}
            </Typography>
            <Typography>
              Viento: {hour.wind_kph} km/h {getWindDirectionInSpanish(hour.wind_dir)}
            </Typography>
            <Typography>
              Condición: {hour.conditionText}
            </Typography>
          </CardContent>
        </Card>
      ))}

      <Typography variant="h6" component="h4" sx={{ mt: 4 }}>Clima con viento para los próximos 7 días</Typography>
      {forecast.daily.map((day) => (
        <Card key={day.date} sx={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
          <CardContent>
            <Typography variant="body2">
              {getDayAndDate(day.date)}
            </Typography>
            <img src={day.day.condition.icon} alt={day.day.condition.text} />
            <Typography>
              Máx: {day.day.maxtemp_c} ºC
            </Typography>
            <Typography>
              Viento: {day.day.maxwind_kph} km/h {getWindDirectionInSpanish(day.day.wind_dir)}
            </Typography>
            <Typography>
              Condición: {day.day.conditionText}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}