import { Box, Typography } from "@mui/material";
import { glassCard } from "../utils/weatherTheme";

export default function WindyMap({ lat, lon, theme }) {
  const url = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&zoom=7&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=true&calendar=now&type=map&location=coordinates&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;

  return (
    <Box sx={{ mt: 4, animation: "slideUp 0.7s cubic-bezier(0.4,0,0.2,1) both", animationDelay: "0.4s" }}>
      <Typography sx={{
        color: theme?.textMuted || "rgba(255,255,255,0.65)",
        fontSize: "0.72rem", fontWeight: 600,
        letterSpacing: "0.1em", textTransform: "uppercase",
        mb: 1.5, px: 0.5,
      }}>
        🌀 Radar de viento en tiempo real
      </Typography>
      <Box sx={{ ...glassCard(theme || {}), p: 0, overflow: "hidden" }}>
        <Box
          component="iframe"
          src={url}
          title="Radar de viento Windy"
          sx={{ width: "100%", height: 400, border: "none", display: "block" }}
          allowFullScreen
        />
      </Box>
    </Box>
  );
}
