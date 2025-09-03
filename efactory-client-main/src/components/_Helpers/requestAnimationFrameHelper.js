const requestAnimationFrame = ( fn ) => {
  let raf =  window.requestAnimationFrame ||
             window.webkitRequestAnimationFrame ||
             window.mozRequestAnimationFrame ||
             window.msRequestAnimationFrame ||
             window.oRequestAnimationFrame
  if( raf ) {
    
    return raf(fn)
  }
  return fn()

}

export default requestAnimationFrame