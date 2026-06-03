import { Box, Typography } from "@mui/material";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AirIcon from "@mui/icons-material/Air";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import { getWindDirectionInSpanish } from "../utils/getWindDirectionInSpanish";
import { glassCard } from "../utils/weatherTheme";

export default function WeatherInfo({ weather, theme }) {
  const windDir = getWindDirectionInSpanish(weather.wind_dir);

  const chip = {
    ...glassCard(theme),
    borderRadius: "14px",
    px: 2,
    py: 1.5,
    display: "flex",
    alignItems: "center",
    gap: 1,
    flex: 1,
    minWidth: 90,
  };

  return (
    <Box
      sx={{
        mt: 3,
        textAlign: "center",
        animation: "slideUp 0.6s cubic-bezier(0.4,0,0.2,1) both",
      }}
    >
      {/* City & Country */}
      <Typography
        variant="h5"
        sx={{
          color: theme.text,
          fontWeight: 300,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontSize: "0.9rem",
          mb: 0.5,
          opacity: 0.85,
        }}
      >
        {weather.city}, {weather.country}
      </Typography>

      {/* Condition text */}
      <Typography
        sx={{ color: theme.textMuted, fontSize: "1rem", mb: 1, fontWeight: 400 }}
      >
        {weather.conditionText}
      </Typography>

      {/* Weather icon */}
      <Box
        component="img"
        src={weather.icon?.replace("//", "https://")}
        alt={weather.conditionText}
        sx={{
          width: 80,
          height: 80,
          filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.3))",
          mb: -1,
        }}
      />

      {/* Big temperature */}
      <Typography
        component="p"
        sx={{
          color: theme.text,
          fontSize: "clamp(80px, 20vw, 112px)",
          fontWeight: 200,
          lineHeight: 1,
          letterSpacing: "-4px",
          mb: 0,
          textShadow: "0 4px 24px rgba(0,0,0,0.2)",
        }}
      >
        {Math.round(weather.temp)}
        <Typography
          component="span"
          sx={{ fontSize: "0.4em", fontWeight: 300, verticalAlign: "top", mt: "0.25em", display: "inline-block", opacity: 0.85 }}
        >
          °C
        </Typography>
      </Typography>

      {/* Stats chips */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          mt: 3,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Box sx={chip}>
          <WaterDropIcon sx={{ fontSize: 18, color: theme.accent }} />
          <Box>
            <Typography sx={{ color: theme.textMuted, fontSize: "0.65rem", lineHeight: 1 }}>
              Humedad
            </Typography>
            <Typography sx={{ color: theme.text, fontSize: "1rem", fontWeight: 600, lineHeight: 1.3 }}>
              {weather.humidity}%
            </Typography>
          </Box>
        </Box>

        <Box sx={chip}>
          <AirIcon sx={{ fontSize: 18, color: theme.accent }} />
          <Box>
            <Typography sx={{ color: theme.textMuted, fontSize: "0.65rem", lineHeight: 1 }}>
              Viento
            </Typography>
            <Typography sx={{ color: theme.text, fontSize: "1rem", fontWeight: 600, lineHeight: 1.3 }}>
              {Math.round(weather.wind_kph)} km/h
            </Typography>
            <Typography sx={{ color: theme.textMuted, fontSize: "0.65rem", lineHeight: 1 }}>
              {windDir.text}
            </Typography>
          </Box>
        </Box>

        <Box sx={chip}>
          <DeviceThermostatIcon sx={{ fontSize: 18, color: theme.accent }} />
          <Box>
            <Typography sx={{ color: theme.textMuted, fontSize: "0.65rem", lineHeight: 1 }}>
              Sensación
            </Typography>
            <Typography sx={{ color: theme.text, fontSize: "1rem", fontWeight: 600, lineHeight: 1.3 }}>
              {Math.round(weather.feelslike_c)}°C
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
