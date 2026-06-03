import { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";

export default function WeatherBackground({ gradient }) {
  const [layers, setLayers] = useState([{ gradient, id: 0 }]);
  const idRef = useRef(0);

  useEffect(() => {
    idRef.current += 1;
    const newId = idRef.current;
    setLayers((prev) => {
      const last = prev[prev.length - 1];
      if (last?.gradient === gradient) return prev;
      return [last, { gradient, id: newId }];
    });
  }, [gradient]);

  return (
    <>
      {layers.map((layer, i) => (
        <Box
          key={layer.id}
          sx={{
            position: "fixed",
            inset: 0,
            background: layer.gradient,
            zIndex: -10 + i,
            opacity: i === layers.length - 1 && layers.length > 1 ? 0 : 1,
            animation:
              i === layers.length - 1 && layers.length > 1
                ? "wbFadeIn 1.8s cubic-bezier(0.4,0,0.2,1) forwards"
                : "none",
          }}
        />
      ))}
    </>
  );
}
