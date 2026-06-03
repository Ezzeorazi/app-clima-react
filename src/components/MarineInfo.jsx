import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import WavesIcon from "@mui/icons-material/Waves";
import { glassCard } from "../utils/weatherTheme";

const MARINE_API = "https://marine-api.open-meteo.com/v1/marine";

const WAVE_LABELS = ["Calma", "Suave", "Moderado", "Alto", "Muy alto"];
function waveLevel(h) {
  if (!h) return 0;
  if (h < 0.3) return 0;
  if (h < 0.6) return 1;
  if (h < 1.2) return 2;
  if (h < 2.0) return 3;
  return 4;
}

function degToDir(deg) {
  if (deg == null) return "—";
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSO","SO","OSO","O","ONO","NO","NNO"];
  return dirs[Math.round(deg / 22.5) % 16];
}

export default function MarineInfo({ lat, lon, theme }) {
  const [marine, setMarine] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lat || !lon) return;
    setLoading(true);
    const p = new URLSearchParams({
      latitude: lat, longitude: lon,
      hourly: "wave_height,wave_direction,swell_wave_height,swell_wave_direction,sea_surface_temperature",
      timezone: "auto", forecast_days: 1,
    });
    fetch(`${MARINE_API}?${p}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) return;
        const now = new Date();
        const str = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}T${String(now.getHours()).padStart(2,"0")}:00`;
        const idx = Math.max(0, data.hourly.time.findIndex((t) => t === str));
        const next6 = Array.from({ length: 6 }, (_, k) => idx + k)
          .filter((j) => j < data.hourly.time.length)
          .map((j) => ({
            time: data.hourly.time[j],
            waveH: data.hourly.wave_height[j],
            waveDir: data.hourly.wave_direction[j],
            swellH: data.hourly.swell_wave_height[j],
            swellDir: data.hourly.swell_wave_direction[j],
            sst: data.hourly.sea_surface_temperature[j],
          }));
        setMarine({ current: next6[0], hourly: next6 });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lat, lon]);

  if (loading) return (
    <Box sx={{ mt: 4, textAlign: "center" }}>
      <CircularProgress size={22} sx={{ color: theme?.textMuted || "rgba(255,255,255,0.5)" }} />
    </Box>
  );
  if (!marine) return null;

  const { current, hourly } = marine;

  const statCard = (label, value, sub) => (
    <Box sx={{ ...glassCard(theme), borderRadius: "16px", p: 2, flex: 1, minWidth: 80, textAlign: "center" }}>
      <Typography sx={{ color: theme.textMuted, fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ color: theme.text, fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.1 }}>
        {value}
      </Typography>
      {sub && <Typography sx={{ color: theme.textMuted, fontSize: "0.65rem", mt: 0.3 }}>{sub}</Typography>}
    </Box>
  );

  return (
    <Box sx={{ mt: 4, animation: "slideUp 0.7s cubic-bezier(0.4,0,0.2,1) both", animationDelay: "0.3s" }}>
      <Typography sx={{ color: theme.textMuted, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", mb: 1.5, px: 0.5, display: "flex", alignItems: "center", gap: 0.8 }}>
        <WavesIcon sx={{ fontSize: 14 }} /> Condiciones marinas
      </Typography>

      {/* 4 stat cards */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
        {statCard("Oleaje", `${current.waveH?.toFixed(1) ?? "—"} m`, WAVE_LABELS[waveLevel(current.waveH)])}
        {statCard("Swell", `${current.swellH?.toFixed(1) ?? "—"} m`, degToDir(current.swellDir))}
        {statCard("Mar", `${current.sst?.toFixed(1) ?? "—"}°C`, "Superficie")}
        {statCard("Dir.", degToDir(current.waveDir), current.waveDir != null ? `${Math.round(current.waveDir)}°` : "—")}
      </Box>

      {/* Hourly rows */}
      <Box sx={{ ...glassCard(theme), overflow: "hidden" }}>
        {hourly.slice(1).map((h, i) => (
          <Box key={i} sx={{
            display: "flex", alignItems: "center", px: 2.5, py: 1.4,
            borderBottom: i < hourly.length - 2 ? `1px solid ${theme.divider}` : "none",
          }}>
            <Typography sx={{ color: theme.textMuted, fontSize: "0.78rem", width: 42, flexShrink: 0 }}>
              {new Date(h.time).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
            </Typography>
            <Typography sx={{ color: theme.text, fontSize: "0.88rem", flex: 1 }}>
              🌊 <strong>{h.waveH?.toFixed(1) ?? "—"} m</strong>
            </Typography>
            <Typography sx={{ color: theme.textMuted, fontSize: "0.82rem", mr: 2 }}>
              Swell {h.swellH?.toFixed(1) ?? "—"} m
            </Typography>
            <Typography sx={{ color: theme.accent, fontSize: "0.82rem", fontWeight: 600, flexShrink: 0 }}>
              {h.sst?.toFixed(1) ?? "—"}°C
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
