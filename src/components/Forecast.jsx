import { Box, Typography } from "@mui/material";
import { glassCard } from "../utils/weatherTheme";

const DAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function getDayName(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return DAYS_ES[d.getDay()];
}

export default function Forecast({ forecast, theme }) {
  const now = new Date();
  const nextHourTs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0).getTime();

  const hourly = forecast.hourly
    .filter((h) => new Date(h.time).getTime() >= nextHourTs)
    .slice(0, 12);

  const daily = forecast.daily;

  const sectionLabel = {
    color: theme.textMuted,
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    mb: 1.5,
    px: 0.5,
  };

  return (
    <Box sx={{ mt: 4 }}>
      {/* ── HOURLY ── */}
      <Typography sx={sectionLabel}>Próximas horas</Typography>
      <Box
        sx={{
          ...glassCard(theme),
          p: 2,
          mb: 3,
          animation: "slideUp 0.7s cubic-bezier(0.4,0,0.2,1) both",
          animationDelay: "0.1s",
        }}
      >
        <Box
          className="no-scrollbar"
          sx={{ display: "flex", gap: 1.5, overflowX: "auto", pb: 0.5 }}
        >
          {hourly.map((h, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
                minWidth: 64,
                py: 1,
                px: 0.5,
                borderRadius: "14px",
                background: i === 0 ? theme.accentBg : "transparent",
                border: i === 0 ? `1px solid ${theme.glassBorder}` : "1px solid transparent",
                transition: "background 0.2s",
                cursor: "default",
                flexShrink: 0,
              }}
            >
              <Typography sx={{ color: theme.textMuted, fontSize: "0.7rem", fontWeight: 500 }}>
                {new Date(h.time).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
              </Typography>
              <Box
                component="img"
                src={h.conditionIcon?.replace("//", "https://")}
                alt={h.conditionText}
                sx={{ width: 36, height: 36 }}
              />
              <Typography sx={{ color: theme.text, fontSize: "0.95rem", fontWeight: 600 }}>
                {Math.round(h.temp_c)}°
              </Typography>
              <Typography sx={{ color: theme.textMuted, fontSize: "0.65rem", textAlign: "center", lineHeight: 1.2 }}>
                {Math.round(h.wind_kph)} km/h
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── DAILY ── */}
      <Typography sx={sectionLabel}>Próximos 7 días</Typography>
      <Box
        sx={{
          ...glassCard(theme),
          overflow: "hidden",
          animation: "slideUp 0.7s cubic-bezier(0.4,0,0.2,1) both",
          animationDelay: "0.2s",
        }}
      >
        {daily.map((day, i) => (
          <Box
            key={day.date}
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2.5,
              py: 1.6,
              borderBottom: i < daily.length - 1 ? `1px solid ${theme.divider}` : "none",
              "&:hover": { background: theme.accentBg },
              transition: "background 0.15s",
            }}
          >
            <Typography
              sx={{ color: theme.text, fontSize: "0.92rem", fontWeight: 500, width: 40, flexShrink: 0 }}
            >
              {i === 0 ? "Hoy" : getDayName(day.date)}
            </Typography>

            <Box
              component="img"
              src={day.day.condition.icon?.replace("//", "https://")}
              alt={day.day.conditionText}
              sx={{ width: 36, height: 36, mx: 1.5, flexShrink: 0 }}
            />

            <Typography
              sx={{
                color: theme.textMuted, fontSize: "0.78rem", flex: 1,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}
            >
              {day.day.conditionText}
            </Typography>

            <Typography sx={{ color: theme.textMuted, fontSize: "0.75rem", mr: 2, flexShrink: 0 }}>
              💨 {Math.round(day.day.maxwind_kph)}
            </Typography>

            <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0, alignItems: "baseline" }}>
              <Typography sx={{ color: theme.text, fontSize: "0.95rem", fontWeight: 600 }}>
                {Math.round(day.day.maxtemp_c)}°
              </Typography>
              <Typography sx={{ color: theme.textMuted, fontSize: "0.82rem" }}>
                / {Math.round(day.day.mintemp_c)}°
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
