import { Box, Card, CardContent, Typography } from "@mui/material";

export default function Forecast({ forecast }) {
  return (
    <Box sx={{ display: "grid", gap: 2, mt: 3 }}>
      {forecast.map((day) => (
        <Card key={day.date} sx={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
          <CardContent>
            <Typography variant="h6">{day.date}</Typography>
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
