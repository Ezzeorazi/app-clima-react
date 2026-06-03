import { useState, useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import CityForm from "./components/CityForm";
import WeatherInfo from "./components/WeatherInfo";
import Forecast from "./components/Forecast";
import RecentSearches from "./components/RecentSearches";
import WindyMap from "./components/WindyMap";
import MarineInfo from "./components/MarineInfo";
import SargassumInfo from "./components/SargassumInfo";
import WeatherBackground from "./components/WeatherBackground";
import { getWeatherTheme, themes } from "./utils/weatherTheme";

const API_WEATHER = `https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_API_KEY}&q=`;

export default function App() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState({ error: false, message: "" });
  const [weather, setWeather] = useState({
    city: "", country: "", temp: 0, condition: 0,
    icon: "", conditionText: "", humidity: 0,
    wind_kph: 0, wind_dir: "", feelslike_c: 0,
    lat: null, lon: null, is_day: 1,
  });
  const [forecast, setForecast] = useState({ hourly: [], daily: [] });
  const [recentSearches, setRecentSearches] = useState(() =>
    JSON.parse(localStorage.getItem("recentSearches")) || []
  );

  const theme = weather.city
    ? getWeatherTheme(weather.condition, weather.is_day === 1)
    : themes.default;

  useEffect(() => {
    const sync = () => setRecentSearches(
      JSON.parse(localStorage.getItem("recentSearches")) || []
    );
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const fetchWeather = async (query) => {
    setLoading(true);
    setError({ error: false, message: "" });
    try {
      const res = await fetch(`${API_WEATHER}${encodeURIComponent(query)}&lang=es&days=7`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || `Error ${res.status}`);

      setWeather({
        city: data.location.name,
        country: data.location.country,
        temp: data.current.temp_c,
        condition: data.current.condition.code,
        icon: data.current.condition.icon,
        conditionText: data.current.condition.text,
        humidity: data.current.humidity,
        wind_kph: data.current.wind_kph,
        wind_dir: data.current.wind_dir,
        feelslike_c: data.current.feelslike_c,
        lat: data.location.lat,
        lon: data.location.lon,
        is_day: data.current.is_day,
      });

      setForecast({
        hourly: data.forecast.forecastday[0].hour.map((h) => ({
          time: h.time,
          temp_c: h.temp_c,
          wind_kph: h.wind_kph,
          wind_dir: h.wind_dir,
          conditionText: h.condition.text,
          conditionIcon: h.condition.icon,
          conditionCode: h.condition.code,
        })),
        daily: data.forecast.forecastday.map((d) => ({
          date: d.date,
          day: {
            maxtemp_c: d.day.maxtemp_c,
            mintemp_c: d.day.mintemp_c,
            condition: d.day.condition,
            maxwind_kph: d.day.maxwind_kph,
            wind_dir: d.day.wind_dir,
            conditionText: d.day.condition.text,
          },
        })),
      });

      const name = data.location.name;
      setCity(name);
      const updated = [name, ...recentSearches.filter((x) => x !== name)].slice(0, 3);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    } catch (err) {
      setError({ error: true, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!city.trim()) { setError({ error: true, message: "El campo es obligatorio" }); return; }
    fetchWeather(city);
  };

  const onGeolocate = () => {
    if (!navigator.geolocation) {
      setError({ error: true, message: "Tu navegador no soporta geolocalización" });
      return;
    }
    setGeoLoading(true);
    setError({ error: false, message: "" });
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setGeoLoading(false); fetchWeather(`${coords.latitude},${coords.longitude}`); },
      () => { setGeoLoading(false); setError({ error: true, message: "No se pudo obtener tu ubicación. Verificá los permisos." }); },
      { timeout: 10000 }
    );
  };

  const onSearchCity = (c) => { setCity(c); fetchWeather(c); };

  return (
    <>
      <WeatherBackground gradient={theme.gradient} />

      <Box sx={{ minHeight: "100vh", pb: 6 }}>
        <Container maxWidth="sm" sx={{ pt: 4, px: { xs: 2, sm: 3 } }}>

          {/* Header */}
          <Typography
            variant="h4"
            align="center"
            sx={{
              color: theme.text,
              fontWeight: 200,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontSize: "1.1rem",
              mb: 3,
              opacity: 0.9,
              animation: "slideUp 0.5s ease both",
            }}
          >
            🌤 App del Clima
          </Typography>

          {/* Search */}
          <Box sx={{ animation: "slideUp 0.5s ease both", animationDelay: "0.05s" }}>
            <CityForm
              city={city}
              setCity={setCity}
              onSubmit={onSubmit}
              loading={loading}
              error={error}
              onGeolocate={onGeolocate}
              geoLoading={geoLoading}
              theme={theme}
            />
          </Box>

          {/* Hero */}
          {weather.city && (
            <WeatherInfo weather={weather} theme={theme} />
          )}

          {/* Forecast */}
          {forecast.daily.length > 0 && (
            <Forecast forecast={forecast} theme={theme} />
          )}

          {/* Marine */}
          {weather.lat && (
            <MarineInfo lat={weather.lat} lon={weather.lon} theme={theme} />
          )}

          {/* Windy radar */}
          {weather.lat && (
            <WindyMap lat={weather.lat} lon={weather.lon} theme={theme} />
          )}

          {/* Sargazo */}
          <SargassumInfo theme={theme} />

          {/* Recent */}
          <RecentSearches
            recentSearches={recentSearches}
            onSearchCity={onSearchCity}
            theme={theme}
          />

          {/* Footer */}
          <Box sx={{ mt: 5, textAlign: "center" }}>
            <Typography sx={{ color: theme.textMuted, fontSize: "0.72rem", letterSpacing: "0.06em" }}>
              © {new Date().getFullYear()} · Desarrollado por{" "}
              <Box
                component="a"
                href="https://ezequiel-orazi.online"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: theme.accent,
                  textDecoration: "none",
                  fontWeight: 600,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Ezequiel Orazi
              </Box>
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}
