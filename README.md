Use as you please.

You need create your strategy like object below:

```js
var MyStrategy = function() {
      
      //Hist regex pattern for split function
	    this.pattern = function() {	    
	        return /[\n\f\r]/;
	    };

      //His action before each object
	    this.action = function(item, $scope){
    		return item.split("\t")[0];
	    }
     
      //His last event when all values have been analyzed by the split function
	    this.finish = function(item, $scope){
	    	console.log("finish", item);
	    }
	};
```
In your scope you need create an function to set his strategy:

```js
$scope.StrategyA = function(){
	return new MyStrategy();
};
````
Put it in your html file:

```html
<angular-paste ng-model="rawPaste" ng-array="parsedPaste" ng-strategy="StrategyA()"/>
```

Add this directive in your Layout page:

```html
<script src="js/directives.js"></script>
```
