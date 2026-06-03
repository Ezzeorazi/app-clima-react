import { Box, Typography } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";

export default function RecentSearches({ recentSearches, onSearchCity, theme }) {
  if (!recentSearches.length) return null;

  const t = theme || {
    chipBg: "rgba(255,255,255,0.14)",
    glassBorder: "rgba(255,255,255,0.24)",
    text: "#fff",
    textMuted: "rgba(255,255,255,0.65)",
  };

  return (
    <Box sx={{ mt: 3, animation: "slideUp 0.5s cubic-bezier(0.4,0,0.2,1) both", animationDelay: "0.6s" }}>
      <Typography sx={{
        color: t.textMuted, fontSize: "0.68rem", fontWeight: 600,
        letterSpacing: "0.1em", textTransform: "uppercase",
        mb: 1, display: "flex", alignItems: "center", gap: 0.6, px: 0.5,
      }}>
        <HistoryIcon sx={{ fontSize: 12 }} /> Recientes
      </Typography>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {recentSearches.map((city, i) => (
          <Box
            key={i}
            onClick={() => onSearchCity(city)}
            sx={{
              background: t.chipBg,
              border: `1px solid ${t.glassBorder}`,
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderRadius: "20px",
              px: 2, py: 0.7,
              cursor: "pointer",
              color: t.text,
              fontSize: "0.82rem",
              fontWeight: 500,
              transition: "all 0.15s ease",
              "&:hover": {
                background: `rgba(255,255,255,0.22)`,
                transform: "translateY(-1px)",
              },
            }}
          >
            {city}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
