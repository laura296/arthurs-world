// Each page has a name, viewBox, and an array of fillable regions.
// Each region: { id, name, d (SVG path), defaultFill }

const pages = [
  {
    id: 'bear',
    name: 'Bear',
    emoji: '🐻',
    viewBox: '0 0 300 340',
    regions: [
      // Body
      { id: 'body', name: 'Body', d: 'M100,180 Q100,140 150,130 Q200,140 200,180 L210,280 Q210,320 150,320 Q90,320 90,280 Z' },
      // Head
      { id: 'head', name: 'Head', d: 'M105,140 Q105,80 150,70 Q195,80 195,140 Q195,165 150,170 Q105,165 105,140 Z' },
      // Left ear
      { id: 'left-ear', name: 'Left Ear', d: 'M108,95 A22,22 0 1,1 120,80' },
      // Right ear
      { id: 'right-ear', name: 'Right Ear', d: 'M192,95 A22,22 0 1,0 180,80' },
      // Belly
      { id: 'belly', name: 'Belly', d: 'M120,200 Q120,185 150,180 Q180,185 180,200 L182,270 Q182,295 150,295 Q118,295 118,270 Z' },
      // Left arm
      { id: 'left-arm', name: 'Left Arm', d: 'M100,175 Q75,185 65,220 Q60,250 75,260 Q88,255 95,230 L100,200 Z' },
      // Right arm
      { id: 'right-arm', name: 'Right Arm', d: 'M200,175 Q225,185 235,220 Q240,250 225,260 Q212,255 205,230 L200,200 Z' },
      // Nose
      { id: 'nose', name: 'Nose', d: 'M140,130 Q140,122 150,120 Q160,122 160,130 Q160,138 150,140 Q140,138 140,130 Z' },
      // Left eye
      { id: 'left-eye', name: 'Left Eye', d: 'M125,110 A7,9 0 1,1 139,110 A7,9 0 1,1 125,110 Z' },
      // Right eye
      { id: 'right-eye', name: 'Right Eye', d: 'M161,110 A7,9 0 1,1 175,110 A7,9 0 1,1 161,110 Z' },
    ],
  },
  {
    id: 'fish',
    name: 'Fish',
    emoji: '🐟',
    viewBox: '0 0 340 260',
    regions: [
      // Body
      { id: 'body', name: 'Body', d: 'M80,130 Q80,60 170,50 Q260,60 270,130 Q260,200 170,210 Q80,200 80,130 Z' },
      // Tail
      { id: 'tail', name: 'Tail', d: 'M270,130 Q290,80 320,60 Q300,130 320,200 Q290,180 270,130 Z' },
      // Top fin
      { id: 'top-fin', name: 'Top Fin', d: 'M150,55 Q170,15 200,25 Q195,50 180,55 Z' },
      // Bottom fin
      { id: 'bottom-fin', name: 'Bottom Fin', d: 'M150,205 Q165,240 190,235 Q185,210 175,205 Z' },
      // Belly stripe
      { id: 'stripe', name: 'Stripe', d: 'M100,120 Q170,110 250,120 L250,140 Q170,150 100,140 Z' },
      // Eye
      { id: 'eye', name: 'Eye', d: 'M115,105 A15,15 0 1,1 145,105 A15,15 0 1,1 115,105 Z' },
      // Mouth
      { id: 'mouth', name: 'Mouth', d: 'M82,135 Q95,145 82,155 Q78,145 82,135 Z' },
    ],
  },
  {
    id: 'butterfly',
    name: 'Butterfly',
    emoji: '🦋',
    viewBox: '0 0 320 280',
    regions: [
      // Body
      { id: 'body', name: 'Body', d: 'M155,50 Q162,50 165,60 L168,240 Q165,255 160,255 Q155,255 152,240 L155,60 Z' },
      // Head
      { id: 'head', name: 'Head', d: 'M148,55 A14,14 0 1,1 172,55 A14,14 0 1,1 148,55 Z' },
      // Left top wing
      { id: 'left-top', name: 'Left Top Wing', d: 'M152,75 Q100,40 40,55 Q20,75 30,115 Q45,140 90,135 Q130,125 152,110 Z' },
      // Right top wing
      { id: 'right-top', name: 'Right Top Wing', d: 'M168,75 Q220,40 280,55 Q300,75 290,115 Q275,140 230,135 Q190,125 168,110 Z' },
      // Left bottom wing
      { id: 'left-bottom', name: 'Left Bottom Wing', d: 'M152,120 Q110,130 55,160 Q30,185 40,215 Q60,240 105,225 Q140,200 152,175 Z' },
      // Right bottom wing
      { id: 'right-bottom', name: 'Right Bottom Wing', d: 'M168,120 Q210,130 265,160 Q290,185 280,215 Q260,240 215,225 Q180,200 168,175 Z' },
      // Left wing spot
      { id: 'left-spot', name: 'Left Spot', d: 'M75,85 A18,18 0 1,1 111,85 A18,18 0 1,1 75,85 Z' },
      // Right wing spot
      { id: 'right-spot', name: 'Right Spot', d: 'M209,85 A18,18 0 1,1 245,85 A18,18 0 1,1 209,85 Z' },
      // Left antenna
      { id: 'left-antenna', name: 'Left Antenna', d: 'M155,42 Q140,20 125,15 A5,5 0 1,1 130,10 Q142,18 155,42 Z' },
      // Right antenna
      { id: 'right-antenna', name: 'Right Antenna', d: 'M165,42 Q180,20 195,15 A5,5 0 1,0 190,10 Q178,18 165,42 Z' },
    ],
  },
  {
    id: 'house',
    name: 'House',
    emoji: '🏠',
    viewBox: '0 0 320 300',
    regions: [
      // Roof
      { id: 'roof', name: 'Roof', d: 'M40,130 L160,30 L280,130 Z' },
      // Wall
      { id: 'wall', name: 'Wall', d: 'M60,130 L260,130 L260,280 L60,280 Z' },
      // Door
      { id: 'door', name: 'Door', d: 'M135,280 L135,195 Q135,180 160,180 Q185,180 185,195 L185,280 Z' },
      // Left window
      { id: 'left-window', name: 'Left Window', d: 'M80,155 L120,155 L120,195 L80,195 Z' },
      // Right window
      { id: 'right-window', name: 'Right Window', d: 'M200,155 L240,155 L240,195 L200,195 Z' },
      // Chimney
      { id: 'chimney', name: 'Chimney', d: 'M220,30 L250,30 L250,95 L220,95 Z' },
      // Door knob
      { id: 'doorknob', name: 'Door Knob', d: 'M170,235 A5,5 0 1,1 180,235 A5,5 0 1,1 170,235 Z' },
      // Path
      { id: 'path', name: 'Path', d: 'M135,280 Q130,290 120,300 L200,300 Q190,290 185,280 Z' },
      // Sun
      { id: 'sun', name: 'Sun', d: 'M280,45 A25,25 0 1,1 280,44.9 Z' },
      // Cloud
      { id: 'cloud', name: 'Cloud', d: 'M20,55 Q20,35 40,35 Q50,20 70,30 Q85,25 90,40 Q105,40 105,55 Q105,70 85,70 L35,70 Q20,70 20,55 Z' },
    ],
  },
  {
    id: 'flower',
    name: 'Flower',
    emoji: '🌸',
    viewBox: '0 0 300 320',
    regions: [
      // Centre
      { id: 'centre', name: 'Centre', d: 'M130,110 A25,25 0 1,1 170,110 A25,25 0 1,1 130,110 Z' },
      // Top petal
      { id: 'top-petal', name: 'Top Petal', d: 'M140,90 Q135,50 150,35 Q165,50 160,90 Z' },
      // Top-right petal
      { id: 'tr-petal', name: 'Top Right Petal', d: 'M168,95 Q195,70 210,75 Q205,95 178,108 Z' },
      // Bottom-right petal
      { id: 'br-petal', name: 'Bottom Right Petal', d: 'M178,122 Q205,135 210,155 Q195,160 168,135 Z' },
      // Bottom petal
      { id: 'bottom-petal', name: 'Bottom Petal', d: 'M160,140 Q165,180 150,195 Q135,180 140,140 Z' },
      // Bottom-left petal
      { id: 'bl-petal', name: 'Bottom Left Petal', d: 'M122,122 Q95,135 90,155 Q105,160 132,135 Z' },
      // Top-left petal
      { id: 'tl-petal', name: 'Top Left Petal', d: 'M132,95 Q105,70 90,75 Q95,95 122,108 Z' },
      // Stem
      { id: 'stem', name: 'Stem', d: 'M145,190 Q148,250 150,310 L155,310 Q153,250 155,190 Z' },
      // Left leaf
      { id: 'left-leaf', name: 'Left Leaf', d: 'M148,240 Q120,220 100,230 Q115,250 148,248 Z' },
      // Right leaf
      { id: 'right-leaf', name: 'Right Leaf', d: 'M153,220 Q180,200 200,210 Q185,230 153,228 Z' },
    ],
  },
  {
    id: 'dinosaur',
    name: 'Dinosaur',
    emoji: '🦕',
    viewBox: '0 0 360 300',
    regions: [
      // Body
      { id: 'body', name: 'Body', d: 'M100,140 Q100,100 160,90 Q240,90 260,120 Q270,140 260,170 Q240,200 160,210 Q100,200 100,140 Z' },
      // Head
      { id: 'head', name: 'Head', d: 'M260,110 Q280,80 310,75 Q335,80 340,100 Q340,120 320,130 Q300,135 270,130 Z' },
      // Neck
      { id: 'neck', name: 'Neck', d: 'M255,115 Q265,105 275,110 L280,128 Q270,135 260,130 Z' },
      // Tail
      { id: 'tail', name: 'Tail', d: 'M100,145 Q70,130 40,140 Q20,155 15,170 Q20,175 30,170 Q50,160 80,165 Q95,170 100,165 Z' },
      // Belly
      { id: 'belly', name: 'Belly', d: 'M120,165 Q120,155 165,150 Q220,155 230,165 Q230,185 165,190 Q120,185 120,165 Z' },
      // Front left leg
      { id: 'fl-leg', name: 'Front Left Leg', d: 'M210,195 L205,260 Q205,275 215,275 Q225,275 225,260 L220,195 Z' },
      // Front right leg
      { id: 'fr-leg', name: 'Front Right Leg', d: 'M230,190 L228,255 Q228,270 238,270 Q248,270 248,255 L240,190 Z' },
      // Back left leg
      { id: 'bl-leg', name: 'Back Left Leg', d: 'M120,195 L115,260 Q115,275 125,275 Q135,275 135,260 L130,195 Z' },
      // Back right leg
      { id: 'br-leg', name: 'Back Right Leg', d: 'M140,190 L138,255 Q138,270 148,270 Q158,270 158,255 L148,190 Z' },
      // Eye
      { id: 'eye', name: 'Eye', d: 'M310,92 A8,8 0 1,1 326,92 A8,8 0 1,1 310,92 Z' },
      // Back spikes
      { id: 'spikes', name: 'Spikes', d: 'M130,92 L140,65 L155,90 L165,60 L180,88 L195,62 L210,90 L225,68 L240,95' },
    ],
  },
];

export default pages;
