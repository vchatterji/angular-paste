Use as you please.

You need to create your strategy object like shown below:

```js
var MyStrategy = function() {
      
     	//The Regex to split data into actionable items
	    this.pattern = function() {	    
	        return /[\n\f\r]/;
	    };

      	//The action per item to return one row of data
	    this.action = function(item, $scope){
	    	//You could even return selected colums like the following
	    	/*
	    	//We will select some columns to return
	    	var selectedData = [];

	    	//The parsed data from the paste
	    	var parsedData = item.split("\t");

	    	//Below we add the 1st and third column from our data
	    	selectedData.push(parsedData[0]);
	    	selectedData.push(parsedData[2]);

	    	//And return it.
	    	return selectedData;
	    	*/
    		return item.split("\t");
	    }
     
      	//The function that will be called after all the actionable items are processed
	    this.finish = function(item, $scope){
	    	console.log("finish", item);
	    }
	};
```
In your scope you need create a function to set the strategy:

```js
$scope.StrategyA = function(){
	return new MyStrategy();
};
````
And add this to your HTML file:

```html
<angular-paste ng-model="rawPaste" ng-array="parsedPaste" ng-strategy="StrategyA()"/>
```

Add this directive in your Layout page:

```html
<script src="js/directives.js"></script>
```
Visit this jsfiddle below to see this directive in action:

[Visit jsfiddle!](http://jsfiddle.net/3agnwfz4/5/)
