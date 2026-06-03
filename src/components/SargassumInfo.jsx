import { useState } from "react";
import { Box, Typography, Link } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { glassCard } from "../utils/weatherTheme";

const USF = "https://optics.marine.usf.edu/projects/SaWS/images";
const MAPS = [
  { label: "Esta semana", src: `${USF}/saws_FAD_composite.png` },
  { label: "−1 sem", src: `${USF}/saws_FAD_composite_1week_ago.png` },
  { label: "−2 sem", src: `${USF}/saws_FAD_composite_2week_ago.png` },
  { label: "−3 sem", src: `${USF}/saws_FAD_composite_3week_ago.png` },
];

function isHighSeason() {
  const m = new Date().getMonth() + 1;
  return m >= 4 && m <= 10;
}

export default function SargassumInfo({ theme }) {
  const [active, setActive] = useState(0);
  const high = isHighSeason();

  const t = theme || {
    glass: "rgba(255,255,255,0.13)",
    glassBorder: "rgba(255,255,255,0.24)",
    glassShadow: "0 8px 32px rgba(0,0,0,0.22)",
    text: "#fff",
    textMuted: "rgba(255,255,255,0.65)",
    accent: "#5DADE2",
    accentBg: "rgba(93,173,226,0.18)",
    divider: "rgba(255,255,255,0.18)",
  };

  return (
    <Box sx={{ mt: 4, animation: "slideUp 0.7s cubic-bezier(0.4,0,0.2,1) both", animationDelay: "0.5s" }}>
      <Typography sx={{
        color: t.textMuted, fontSize: "0.72rem", fontWeight: 600,
        letterSpacing: "0.1em", textTransform: "uppercase", mb: 1.5, px: 0.5,
      }}>
        🌿 Monitoreo de sargazo — Caribe Mexicano
      </Typography>

      {/* Season alert */}
      <Box sx={{
        ...glassCard(t),
        mb: 2,
        px: 2.5, py: 1.5,
        background: high ? "rgba(255,160,40,0.18)" : "rgba(80,200,100,0.18)",
        borderColor: high ? "rgba(255,160,40,0.4)" : "rgba(80,200,100,0.4)",
        display: "flex", alignItems: "center", gap: 1.5,
      }}>
        <Typography sx={{ fontSize: "1.4rem" }}>{high ? "⚠️" : "✅"}</Typography>
        <Box>
          <Typography sx={{ color: t.text, fontSize: "0.88rem", fontWeight: 600, lineHeight: 1.2 }}>
            {high ? "Temporada ALTA de sargazo" : "Temporada baja de sargazo"}
          </Typography>
          <Typography sx={{ color: t.textMuted, fontSize: "0.75rem" }}>
            {high
              ? "Mayo–Septiembre es el pico en Playa del Carmen y Riviera Maya."
              : "Noviembre–Marzo suele ser baja incidencia en el Caribe mexicano."}
          </Typography>
        </Box>
      </Box>

      {/* Satellite map */}
      <Box sx={{ ...glassCard(t), overflow: "hidden", mb: 2 }}>
        {/* Week toggle */}
        <Box sx={{ display: "flex", borderBottom: `1px solid ${t.divider}` }}>
          {MAPS.map((m, i) => (
            <Box
              key={i}
              onClick={() => setActive(i)}
              sx={{
                flex: 1, py: 1.2, textAlign: "center", cursor: "pointer",
                background: active === i ? t.accentBg : "transparent",
                borderRight: i < MAPS.length - 1 ? `1px solid ${t.divider}` : "none",
                transition: "background 0.2s",
                "&:hover": { background: t.accentBg },
              }}
            >
              <Typography sx={{
                color: active === i ? t.text : t.textMuted,
                fontSize: "0.7rem", fontWeight: active === i ? 600 : 400,
              }}>
                {m.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Image */}
        <Box sx={{ p: 1.5 }}>
          <Box
            component="img"
            src={MAPS[active].src}
            alt={`Sargazo ${MAPS[active].label}`}
            sx={{ width: "100%", borderRadius: "10px", display: "block" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <Typography sx={{ color: t.textMuted, fontSize: "0.65rem", mt: 1, textAlign: "center" }}>
            Fuente: USF Optical Oceanography Lab — actualizado semanalmente.{" "}
            <Link href="https://optics.marine.usf.edu/projects/SaWS.html" target="_blank" rel="noopener"
              sx={{ color: t.accent, display: "inline-flex", alignItems: "center", gap: 0.3 }}>
              Ver mapa completo <OpenInNewIcon sx={{ fontSize: 10 }} />
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* Info card */}
      <Box sx={{ ...glassCard(t), px: 2.5, py: 2 }}>
        <Typography sx={{ color: t.text, fontSize: "0.82rem", fontWeight: 600, mb: 1 }}>
          ¿Cómo leer el mapa?
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2, color: t.textMuted, fontSize: "0.78rem", lineHeight: 1.8 }}>
          <li>Las zonas <strong style={{ color: t.text }}>blancas/amarillas</strong> indican acumulaciones de sargazo detectadas por satélite.</li>
          <li>Las corrientes llevan el sargazo hacia Quintana Roo entre mayo y septiembre.</li>
          <li>Para reportes diarios de playa:{" "}
            <Link href="https://www.sargassummonitoring.com/en/beaches-report" target="_blank" rel="noopener" sx={{ color: t.accent }}>
              sargassummonitoring.com
            </Link>
          </li>
        </Box>
      </Box>
    </Box>
  );
}
