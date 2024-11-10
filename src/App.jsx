import { useState, useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import CityForm from "./components/CityForm";
import WeatherInfo from "./components/WeatherInfo";
import Forecast from "./components/Forecast";
import RecentSearches from "./components/RecentSearches"; // Importamos el componente

// API base URL
const API_WEATHER = `https://api.weatherapi.com/v1/forecast.json?key=${
  import.meta.env.VITE_API_KEY
}&q=`;

export default function App() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    message: "",
  });
  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temp: 0,
    condition: "",
    icon: "",
    conditionText: "",
    humidity: 0,
    wind_kph: 0,
    feelslike_c: 0,
  });
  const [forecast, setForecast] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  // Cargar las últimas 3 búsquedas desde localStorage
  useEffect(() => {
    const storedSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(storedSearches);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({
      error: false,
      message: "",
    });
    try {
      if (!city.trim()) throw { message: "El campo es obligatorio" };

      const response = await fetch(API_WEATHER + city + "&days=7"); // Fetch 7 days forecast
      const data = await response.json();

      if (data.error) throw { message: data.error.message };

      setWeather({
        city: data.location.name,
        country: data.location.country,
        temp: data.current.temp_c,
        condition: data.current.condition.code,
        icon: data.current.condition.icon,
        conditionText: data.current.condition.text,
        humidity: data.current.humidity,
        wind_kph: data.current.wind_kph,
        feelslike_c: data.current.feelslike_c,
      });

      // Pronóstico extendido
      setForecast(data.forecast.forecastday);

      // Guardar las últimas 3 búsquedas en localStorage
      const updatedSearches = [
        city,
        ...recentSearches.filter((item) => item !== city),
      ].slice(0, 3);
      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    } catch (error) {
      setError({
        error: true,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar clic en una ciudad de las búsquedas recientes
  const onSearchCity = (city) => {
    setCity(city); // Actualizamos la ciudad seleccionada
    onSubmit({ preventDefault: () => {} }); // Realizamos la búsqueda inmediatamente
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 2 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        App del clima
      </Typography>

      <CityForm
        city={city}
        setCity={setCity}
        onSubmit={onSubmit}
        loading={loading}
        error={error}
      />

      {/* Información del clima actual */}
      {weather.city && <WeatherInfo weather={weather} />}

      {/* Pronóstico extendido */}
      {forecast.length > 0 && <Forecast forecast={forecast} />}

      {/* Mostrar las últimas 3 búsquedas */}
      <RecentSearches
        recentSearches={recentSearches}
        onSearchCity={onSearchCity}
      />

      {/* Footer con el mensaje de copyright */}
      <Box sx={{ mt: 3, textAlign: "center", fontSize: "14px", color: "#888" }}>
        <Typography variant="body2" component="p">
          © 2024 Ezequiel Orazi. Todos los derechos reservados.
        </Typography>
      </Box>
    </Container>
  );
}
