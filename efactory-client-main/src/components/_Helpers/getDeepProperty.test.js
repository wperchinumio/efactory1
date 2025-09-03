import getDeepProperty from './getDeepProperty'

it('gets deep property of an object ', () => {
	
	let obj = { key1 : { key2 : { value : 123 } }  }
	let pathToProp = [ 'key1', 'key2', 'value' ]
	let returnValue = 125
  
  expect(getDeepProperty(
  	obj,
  	pathToProp,
  	returnValue
  )).toEqual(123)

  obj = { key1 : { key2 : { value : 123 } }  }
	pathToProp = [ 'key1', 'key3', 'value' ]
	returnValue = 125

  expect(getDeepProperty(
  	obj,
  	pathToProp,
  	returnValue
  )).toEqual(returnValue)
});