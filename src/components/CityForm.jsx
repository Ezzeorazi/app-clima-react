import { Box, InputBase, Tooltip, IconButton, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { glassCard } from "../utils/weatherTheme";

export default function CityForm({ city, setCity, onSubmit, loading, error, onGeolocate, geoLoading, theme }) {
  const t = theme || {
    glass: "rgba(255,255,255,0.18)",
    glassBorder: "rgba(255,255,255,0.35)",
    text: "#fff",
    textMuted: "rgba(255,255,255,0.65)",
    accent: "#fff",
  };

  return (
    <Box
      component="form"
      autoComplete="off"
      onSubmit={onSubmit}
      sx={{ position: "relative" }}
    >
      <Box
        sx={{
          ...glassCard(t),
          borderRadius: "50px",
          display: "flex",
          alignItems: "center",
          px: 2,
          py: 0.5,
          gap: 1,
          transition: "box-shadow 0.2s ease",
          "&:focus-within": {
            boxShadow: `0 0 0 2px ${t.glassBorder}, ${t.glassShadow}`,
          },
        }}
      >
        <SearchIcon sx={{ color: t.textMuted, fontSize: 22, flexShrink: 0 }} />
        <InputBase
          placeholder="Buscar ciudad..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          fullWidth
          sx={{
            color: t.text,
            fontSize: "1rem",
            fontWeight: 400,
            "& input": { padding: "8px 0" },
            "& input::placeholder": { color: t.textMuted, opacity: 1 },
          }}
          inputProps={{ "aria-label": "ciudad" }}
        />
        <Tooltip title="Usar mi ubicación">
          <span>
            <IconButton
              onClick={onGeolocate}
              disabled={geoLoading || loading}
              size="small"
              sx={{
                color: t.textMuted,
                "&:hover": { color: t.text, background: t.accentBg },
                flexShrink: 0,
              }}
            >
              {geoLoading ? (
                <CircularProgress size={18} sx={{ color: t.textMuted }} />
              ) : (
                <MyLocationIcon sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          </span>
        </Tooltip>
        <IconButton
          type="submit"
          disabled={loading}
          size="small"
          sx={{
            background: t.accent || "rgba(255,255,255,0.25)",
            color: t.name === "snow" ? "#1a3a5c" : "#fff",
            "&:hover": { background: t.accent, opacity: 0.85 },
            "&:disabled": { opacity: 0.5 },
            flexShrink: 0,
            width: 34,
            height: 34,
          }}
        >
          {loading ? (
            <CircularProgress size={16} sx={{ color: "inherit" }} />
          ) : (
            <SearchIcon sx={{ fontSize: 18 }} />
          )}
        </IconButton>
      </Box>

      {error.error && (
        <Box
          sx={{
            mt: 1,
            px: 2,
            py: 0.75,
            borderRadius: "12px",
            background: "rgba(255,80,80,0.22)",
            border: "1px solid rgba(255,80,80,0.4)",
            color: "#fff",
            fontSize: "0.82rem",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          {error.message}
        </Box>
      )}
    </Box>
  );
}
