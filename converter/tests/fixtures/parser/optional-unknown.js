;(function iife(param1 = 'radDefault', param2) {
  const { nice = 'woo' } = param2
  console.log('iife')
  const thing = 'bongos'
  return {
    cool: thing
  }
})()