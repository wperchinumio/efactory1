/**
 * @desc gets the deep value of an object with the given pathname 
 *
 * @param {object} deepObject object to derive the value of given pathname
 * @param {array} pathToValue path to the derived value
 * @param {*} returnType if the derived value is undefined, returnType will be returned
 * 
 * @return {*}
 */

 /*
  * @todo consider acceting path as a string for performance 
  *
  */
const getDeepProperty = ( deepObject = {} , pathToValue = [], returnType ) => {
  return pathToValue.reduce( (prev, next, index) => {
    if( prev[ next ] ) return prev[ next ]
    else return index + 1 === pathToValue.length ? returnType : {}
  }, deepObject )
}

export default getDeepProperty