/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SouthWestIcon from '@mui/icons-material/SouthWest';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NorthWestIcon from '@mui/icons-material/NorthWest';

const iconStyle = css`
  vertical-align: middle;
  margin-right: 4px;
`;

export const getWindDirectionInSpanish = (direction) => {
  const directions = {
    N: { text: "Norte", icon: <ArrowUpwardIcon css={iconStyle} /> },
    NNE: { text: "Nornoreste", icon: <NorthEastIcon css={iconStyle} /> },
    NE: { text: "Noreste", icon: <NorthEastIcon css={iconStyle} /> },
    ENE: { text: "Estenoreste", icon: <NorthEastIcon css={iconStyle} /> },
    E: { text: "Este", icon: <ArrowForwardIcon css={iconStyle} /> },
    ESE: { text: "Estesudeste", icon: <SouthEastIcon css={iconStyle} /> },
    SE: { text: "Sudeste", icon: <SouthEastIcon css={iconStyle} /> },
    SSE: { text: "Sudsudeste", icon: <SouthEastIcon css={iconStyle} /> },
    S: { text: "Sur", icon: <ArrowDownwardIcon css={iconStyle} /> },
    SSW: { text: "Sursudoeste", icon: <SouthWestIcon css={iconStyle} /> },
    SW: { text: "Sudoeste", icon: <SouthWestIcon css={iconStyle} /> },
    WSW: { text: "Oestesudoeste", icon: <SouthWestIcon css={iconStyle} /> },
    W: { text: "Oeste", icon: <ArrowBackIcon css={iconStyle} /> },
    WNW: { text: "Oestenoroeste", icon: <NorthWestIcon css={iconStyle} /> },
    NW: { text: "Noroeste", icon: <NorthWestIcon css={iconStyle} /> },
    NNW: { text: "Nornoroeste", icon: <NorthWestIcon css={iconStyle} /> },
  };
  return directions[direction] || { text: direction, icon: null };
};