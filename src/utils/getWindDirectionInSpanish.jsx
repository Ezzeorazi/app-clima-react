export const getWindDirectionInSpanish = (direction) => {
    const directions = {
      N: "Norte",
      NNE: "Nornoreste",
      NE: "Noreste",
      ENE: "Estenoreste",
      E: "Este",
      ESE: "Estesudeste",
      SE: "Sudeste",
      SSE: "Sudsudeste",
      S: "Sur",
      SSW: "Sursudoeste",
      SW: "Sudoeste",
      WSW: "Oestesudoeste",
      W: "Oeste",
      WNW: "Oestenoroeste",
      NW: "Noroeste",
      NNW: "Nornoroeste",
    };
    return directions[direction] || direction;
  };