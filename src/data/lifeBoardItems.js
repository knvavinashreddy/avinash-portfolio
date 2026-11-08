// Items on the draggable "off the clock" board. x / y are pixels on a 920×560 board, tilt is in degrees.
// Notes come in four colours: ice, powder, mist, sky.

export const lifeBoardItems = [
  { id: 'sports', type: 'note', color: 'ice', x: 40, y: 40, tilt: -4, title: 'Sports', text: 'Will drop everything for a match. Yes, even a deadline.' },
  { id: 'music', type: 'note', color: 'lilac', x: 290, y: 70, tilt: 3, title: 'Music lover', text: 'Headphones on, world off. Hit the record player up top.' },
  { id: 'food', type: 'note', color: 'mint', x: 40, y: 290, tilt: 2, title: 'Food lover', text: 'Bhimavaram food is a personality trait. Ask me for recommendations.' },
  { id: 'games', type: 'note', color: 'blush', x: 300, y: 320, tilt: -3, title: 'Gamer', text: 'Ranked queue builds character. Debugging builds more.' },
  { id: 'ticket', type: 'ticket', x: 560, y: 40, tilt: 2 },
  { id: 'photo1', type: 'photo', x: 560, y: 230, tilt: -5, caption: 'add a photo' },
  { id: 'photo2', type: 'photo', x: 715, y: 270, tilt: 4, caption: 'and another' },
]
