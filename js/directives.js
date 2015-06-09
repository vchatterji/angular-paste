'use strict';

/* Directives */
angular.module('myApp.directives', [])
 .directive('angularPaste', ['$parse', '$document',
    function ($parse, $document) {
        
        var Strategy = function() {
            
            this.strategy = {
                pattern: function(){ 
                    return /[\n\f\r]/;
                }, 
                action: function(item, scope){ 
                    return  item.trim().split("\t")[0]; 
                }
            };

        };

        Strategy.prototype = {
            
            setStrategy: function(strategy) {
                this.strategy = strategy;
            },   

            pattern: function() {
                return this.strategy.pattern();
            },

            action: function(item, scope){
                return this.strategy.action(item,scope);
            },

            finish: function(item, scope){
                return this.strategy.finish(item, scope);
            }
        };

        var config = {
            idPasteBox: '_AngularPasteBox_' + (new Date()).getTime().toString(),
            elementPasteBox: null,
            defaultStrategy: {

                pattern: function(){ 
                    return /[\n\f\r]/; 
                }, 

                action: function(item, scope){ 
                    return  item.trim().split("\t")[0]; 
                }
            }
        }

        return {
            restrict:'E',
            link:function (scope, element, attrs) {

                //We do not want to eat up chars if some text box is focussed
                //this variable will be set to true if focus is currently on
                //a textbox
                var inFocus = false;

                function parseTabular(text) {
                    //The array we will return
                    var toReturn = [];

                    try {

                        var strategy = new Strategy();

                        strategy.setStrategy(scope.$eval(attrs.ngStrategy) || config.defaultStrategy);

                        var rows = text.split(strategy.pattern());

                        rows.forEach(function (thisRow) {
                           toReturn.push(strategy.action(thisRow, scope));
                        });

                        strategy.finish(rows, scope);

                        toReturn.pop();
                    }
                    catch (err) {
                        console.log('error parsing as tabular data');
                        console.log(err);
                        return null;
                    }
                    return toReturn;
                }

                function textChanged() {

                    var text = config.elementPasteBox.val();

                    if (text != '') {
                        //We need to change the scope values
                        scope.$apply(function () {
                            
                            if (attrs.ngModel != undefined && attrs.ngModel != '') {

                                $parse(attrs.ngModel).assign(scope, text);

                            }

                            if (attrs.ngArray != undefined && attrs.ngArray != '') {
                            
                                var asArray = parseTabular(text);
                            
                                if (asArray != null) {
                                    $parse(attrs.ngArray).assign(scope, asArray);
                                }                                
                            }
                        });
                    }

                }


                $document.ready(function () {
                    //Handles the Ctrl + V keys for pasting
                    function handleKeyDown(e, args) {
                        if (!inFocus && e.which == keyCodes.V && (e.ctrlKey || e.metaKey)) {    // CTRL + V
                            //reset value of our box
                            config.elementPasteBox.val('');
                            //set it in focus so that pasted text goes inside the box
                            config.elementPasteBox.focus();
                        }
                    }

                    //We add a text area to the body only if it is not already created by another myPaste directive
                    if (angular.element(config.idPasteBox).length == 0) {

                        config.elementPasteBox = angular.element('<textarea>');
                        config.elementPasteBox.attr('id', config.idPasteBox);
                        config.elementPasteBox.css({
                            position: 'absolute',
                            left: '-1000px',
                            top: '-1000px'
                        });

                        angular.element('body').append(config.elementPasteBox);

                        var keyCodes = {
                            'C':67,
                            'V':86
                        }

                        //Setup live functions for focus check
                        //(we don't want to steal text if user is already
                        //focussed on a text element)
                        angular.element('input, textarea').live("focus", function () {
                            //If this is true, we wont respond to Ctrl + V
                            inFocus = true;
                        });

                        angular.element('input, textarea').live("blur", function () {
                            //We are not on a text element so we will respond
                            //to Ctrl + V
                            inFocus = false;
                        });

                        //Handle the key down event
                        angular.element(document).keydown(handleKeyDown);

                        //We will respond to when the textbox value changes
                        config.elementPasteBox.bind('input propertychange', textChanged);
                    }
                    else {
                        //We will respond to when the textbox value changes
                        config.elementPasteBox.bind('input propertychange', textChanged);
                    }
                });
            }
        }
    }]);
