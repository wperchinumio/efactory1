# Guidelines for Developing a Component

* Don't make an api request in the 'constructor' method of a component. 
	
	* Because when you want to initialize a component by changing its key, only the constructor method is not being called. 
	
	* Prefer to make requests in 'componentDidMount' method.