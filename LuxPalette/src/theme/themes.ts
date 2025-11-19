// Mondrian/Kandinsky inspired color palette - Refined
const BEIGE = '#F5F1E8'; // Warm beige canvas background
const CREAM = '#FAF8F3'; // Lighter cream for elevated surfaces
const DARK_BEIGE = '#E8DFD0'; // Warmer darker beige
const CHARCOAL = '#2D2926'; // Deep charcoal for text (softer than pure black)
const GRID_BLACK = '#1A1714'; // Mondrian grid lines
const RED = '#D32F2F'; // True Mondrian red (deeper, more authentic)
const BLUE = '#1565C0'; // True Mondrian blue (deeper primary)
const YELLOW = '#FBC02D'; // True Mondrian yellow (warmer, more mustard)
const WHITE = '#FDFCFA'; // Warm off-white
const SHADOW = 'rgba(29, 25, 20, 0.08)'; // Warm shadow

export const darkTheme = {
  background: '#2B2622', // Dark warm brown-beige
  card: 'rgba(250, 248, 243, 0.06)', // Subtle warm overlay
  elevated: 'rgba(250, 248, 243, 0.12)',
  text: CREAM,
  subtext: '#B8AFA3',
  primary: RED,
  secondary: BLUE,
  accent: YELLOW,
  gridLine: CREAM,
  tabBar: '#201D1A',
  shadow: 'rgba(0, 0, 0, 0.4)',
};

export const lightTheme = {
  background: BEIGE, // Main beige canvas
  card: CREAM, // Elevated cream surfaces
  elevated: WHITE, // Highest elevation
  text: CHARCOAL, // Soft dark text
  subtext: '#7A6F65',
  primary: RED, // Authentic Mondrian red
  secondary: BLUE, // Authentic Mondrian blue
  accent: YELLOW, // Authentic Mondrian yellow
  gridLine: GRID_BLACK, // Strong black grid lines
  tabBar: DARK_BEIGE,
  shadow: SHADOW,
};
