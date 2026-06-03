import { useState, useRef, useEffect } from "react";
import { Box, InputBase, Tooltip, IconButton, CircularProgress, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { glassCard } from "../utils/weatherTheme";

const SEARCH_API = `https://api.weatherapi.com/v1/search.json?key=${import.meta.env.VITE_API_KEY}&q=`;

export default function CityForm({ city, setCity, onSubmit, loading, error, onGeolocate, geoLoading, theme }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);
  const wrapperRef = useRef(null);

  const t = theme || {
    glass: "rgba(255,255,255,0.18)",
    glassBorder: "rgba(255,255,255,0.35)",
    glassShadow: "0 8px 32px rgba(0,0,0,0.18)",
    text: "#fff",
    textMuted: "rgba(255,255,255,0.65)",
    accent: "#fff",
    accentBg: "rgba(255,255,255,0.12)",
    divider: "rgba(255,255,255,0.15)",
  };

  // Cierra el dropdown si se hace click fuera
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setCity(val);

    clearTimeout(debounceRef.current);
    if (val.trim().length < 2) {
      setSuggestions([]);
      setNoResults(false);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      // Cancela la request anterior si todavía está en vuelo
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      setSearchLoading(true);
      try {
        const res = await fetch(`${SEARCH_API}${encodeURIComponent(val)}`, {
          signal: abortRef.current.signal,
        });
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSuggestions(data.slice(0, 5));
          setNoResults(false);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setNoResults(true);
          setShowSuggestions(true);
        }
      } catch (err) {
        if (err.name !== "AbortError") setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 350);
  };

  const handleSelectSuggestion = (suggestion) => {
    setShowSuggestions(false);
    setNoResults(false);
    setSuggestions([]);
    // Usamos lat,lon para búsqueda exacta sin ambigüedad
    setCity(suggestion.name);
    onSubmit({ preventDefault: () => {}, _query: `${suggestion.lat},${suggestion.lon}` });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    setNoResults(false);
    onSubmit(e);
  };

  return (
    <Box ref={wrapperRef} sx={{ position: "relative" }}>
      <Box
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit}
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
            onChange={handleChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            fullWidth
            sx={{
              color: t.text,
              fontSize: "1rem",
              "& input": { padding: "8px 0" },
              "& input::placeholder": { color: t.textMuted, opacity: 1 },
            }}
            inputProps={{ "aria-label": "ciudad" }}
          />
          {searchLoading && (
            <CircularProgress size={14} sx={{ color: t.textMuted, flexShrink: 0 }} />
          )}
          <Tooltip title="Usar mi ubicación">
            <span>
              <IconButton
                onClick={onGeolocate}
                disabled={geoLoading || loading}
                size="small"
                sx={{ color: t.textMuted, "&:hover": { color: t.text, background: t.accentBg }, flexShrink: 0 }}
              >
                {geoLoading
                  ? <CircularProgress size={18} sx={{ color: t.textMuted }} />
                  : <MyLocationIcon sx={{ fontSize: 20 }} />
                }
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
              "&:hover": { opacity: 0.85 },
              "&:disabled": { opacity: 0.5 },
              flexShrink: 0,
              width: 34,
              height: 34,
            }}
          >
            {loading
              ? <CircularProgress size={16} sx={{ color: "inherit" }} />
              : <SearchIcon sx={{ fontSize: 18 }} />
            }
          </IconButton>
        </Box>

        {/* Error */}
        {error.error && (
          <Box sx={{
            mt: 1, px: 2, py: 0.75, borderRadius: "12px",
            background: "rgba(255,80,80,0.22)", border: "1px solid rgba(255,80,80,0.4)",
            color: "#fff", fontSize: "0.82rem",
            backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          }}>
            {error.message}
          </Box>
        )}
      </Box>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <Box sx={{
          ...glassCard(t),
          position: "absolute",
          top: "calc(100% + 8px)",
          left: 0,
          right: 0,
          zIndex: 100,
          borderRadius: "16px",
          overflow: "hidden",
          py: 0.5,
        }}>
          {noResults && suggestions.length === 0 ? (
            <Box sx={{ px: 2.5, py: 1.8, display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography sx={{ fontSize: "1rem" }}>🔍</Typography>
              <Box>
                <Typography sx={{ color: t.text, fontSize: "0.85rem", fontWeight: 500 }}>
                  Sin resultados
                </Typography>
                <Typography sx={{ color: t.textMuted, fontSize: "0.72rem" }}>
                  Probá con el nombre de la ciudad principal (ej: "Ushuaia" en vez de "Tierra del Fuego")
                </Typography>
              </Box>
            </Box>
          ) : (
            suggestions.map((s, i) => (
              <Box
                key={s.id}
                onClick={() => handleSelectSuggestion(s)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 2,
                  py: 1.2,
                  cursor: "pointer",
                  borderBottom: i < suggestions.length - 1 ? `1px solid ${t.divider}` : "none",
                  transition: "background 0.15s",
                  "&:hover": { background: t.accentBg },
                }}
              >
                <LocationOnIcon sx={{ fontSize: 16, color: t.accent, flexShrink: 0 }} />
                <Box>
                  <Typography sx={{ color: t.text, fontSize: "0.88rem", fontWeight: 500, lineHeight: 1.2 }}>
                    {s.name}
                  </Typography>
                  <Typography sx={{ color: t.textMuted, fontSize: "0.72rem" }}>
                    {s.region && `${s.region}, `}{s.country}
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
      )}
    </Box>
  );
}
