// A curated list of artistic/creative color names for the app vibe
// Format: [r, g, b, "Name"]
const colorNames: [number, number, number, string][] = [
  [230, 57, 70, "Imperial Red"],
  [241, 250, 238, "Honeydew"],
  [168, 218, 220, "Powder Blue"],
  [69, 123, 157, "Celadon Blue"],
  [29, 53, 87, "Prussian Blue"],
  [255, 0, 0, "Bauhaus Red"],
  [0, 0, 255, "International Blue"],
  [255, 255, 0, "Standard Yellow"],
  [255, 255, 255, "Studio White"],
  [0, 0, 0, "Ink Black"],
  [245, 240, 232, "Warm Beige"],
  [230, 195, 195, "Dusty Rose"],
  [168, 77, 77, "Marsala"],
  [92, 40, 40, "Dried Blood"],
  [245, 230, 204, "Champagne"],
  [184, 216, 216, "Opal"],
  [122, 158, 158, "Verdigris"],
  [79, 109, 109, "Deep Teal"],
  [232, 213, 149, "Straw"],
  [201, 166, 107, "Old Gold"],
  [140, 109, 59, "Bronze"],
  [88, 24, 69, "Tyrian Purple"],
  [144, 190, 109, "Pistachio"],
  [243, 114, 44, "Coral"],
  [249, 65, 68, "Vermilion"],
  [43, 45, 66, "Gunmetal"],
  [141, 153, 174, "Cool Grey"],
  [237, 242, 244, "Anti-Flash White"],
  [217, 4, 41, "Amaranth"],
  [255, 183, 3, "Selective Yellow"],
  [251, 133, 0, "UCLA Gold"],
  [18, 103, 130, "Metallic Seaweed"],
  [33, 158, 188, "Cerulean"],
  [255, 183, 178, "Melon"],
  [255, 158, 205, "Cameo Pink"],
  [255, 204, 249, "Pale Magenta"],
  [188, 204, 255, "Periwinkle"],
  [158, 255, 255, "Electric Blue"],
  [166, 255, 194, "Mint Green"],
  [255, 255, 158, "Canary"],
  [255, 214, 165, "Apricot"],
  [50, 50, 50, "Charcoal"],
  [80, 80, 80, "Dim Grey"],
  [120, 120, 120, "Battleship Grey"],
  [200, 200, 200, "Silver"],
  [153, 102, 102, "Rose Taupe"],
  [102, 153, 102, "Sage"],
  [102, 102, 153, "Mountbatten Pink"],
  [153, 153, 102, "Khaki"],
  [102, 153, 153, "Cadet Blue"],
  [153, 102, 153, "Old Lavender"],
  [89, 13, 34, "Claret"],
  [128, 15, 47, "Burgundy"],
  [168, 19, 61, "Cardinal"],
  [201, 24, 74, "Crimson"],
  [255, 77, 109, "French Rose"],
  [255, 117, 143, "Tickle Me Pink"],
  [255, 143, 163, "Baker-Miller Pink"],
  [255, 179, 193, "Cherry Blossom"],
  [255, 204, 213, "Mimi Pink"],
  [255, 240, 243, "Lavender Blush"]
];

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] 
    : [0, 0, 0];
}

export function getColorName(hex: string): string {
  const [r1, g1, b1] = hexToRgb(hex);
  let minDistance = Infinity;
  let closestName = "Unknown";

  for (const [r2, g2, b2, name] of colorNames) {
    // Simple Euclidean distance in RGB space
    const distance = Math.sqrt(
      Math.pow(r2 - r1, 2) + 
      Math.pow(g2 - g1, 2) + 
      Math.pow(b2 - b1, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestName = name;
    }
  }
  
  return closestName;
}
