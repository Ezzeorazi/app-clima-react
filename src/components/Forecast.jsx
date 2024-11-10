import { Box, Card, CardContent, Typography } from "@mui/material";

export default function Forecast({ forecast }) {
  // Función para obtener el nombre del día y la fecha
  const getDayAndDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("es-ES", options); // Formato: "Lunes, 10 de Noviembre de 2024"
  };

  return (
    <Box sx={{ display: "grid", gap: 2, mt: 3 }}>
      {forecast.map((day) => (
        <Card key={day.date} sx={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
          <CardContent>
            {/* Mostrar el día y la fecha en tamaño pequeño */}
            <Typography variant="body2">
              {getDayAndDate(day.date)}
            </Typography>
            <img src={day.day.condition.icon} alt={day.day.condition.text} />
            <Typography>
              Máx: {day.day.maxtemp_c} ºC
            </Typography>
            <Typography>
              Mín: {day.day.mintemp_c} ºC
            </Typography>
            <Typography>{day.day.condition.text}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
