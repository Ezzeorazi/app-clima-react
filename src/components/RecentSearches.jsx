import { Box, Typography, Button } from "@mui/material";

export default function RecentSearches({ recentSearches, onSearchCity }) {
  return (
    <Box sx={{ mt: 2, textAlign: "center" }}>
      <Typography variant="body1">Últimas búsquedas:</Typography>
      <Box>
        {recentSearches.map((searchedCity, index) => (
          <Button
            key={index}
            onClick={() => onSearchCity(searchedCity)} // Ejecuta la búsqueda al hacer clic
            variant="text"
            sx={{ display: "block", textAlign: "left", margin: "5px auto" }}
          >
            {searchedCity}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
