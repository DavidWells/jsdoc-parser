const radDefault = { lol: { cool: true } };

(function iife(rad = 'radDefault', lol = nice) {
  console.log('iife')
  return 'cool'
})()