// FPSMeter.js
// Copyright David Corvoysier 2011
// http://www.kaizou.org

var NB_ITERATIONS = 10; // Number of iterations
var TARGET_FRAMES = 60; // Base Number of reference frames inspected

function FPSMeter(progress,end){
	this.progress = progress;
	this.end = end;
	this.values = null;
	this.maxIterations = NB_ITERATIONS;
	this.curIterations = 0;
	this.startTime = 0;
	this.nbMeasures = 0;
	this.storeTimeout = 0;
	this.fpsValues = null;
	this.ref=document.getElementById("AnimBenchRef");
    if (this.ref==null) {
        this.ref = document.createElement("div");
        this.ref.setAttribute("id", "AnimBenchRef");
        var style = "-webkit-transition: all 1s linear;";
        style += "-moz-transition: all 1s linear;";
        style += "-o-transition: all 1s linear;";
        style += "position: absolute;";
        style += "width: 1px;";
        style += "height: 1px;";
        style += "left: 0px;";
        style += "bottom: 0px;";
        style += "background-color: transparent;";
        this.ref.setAttribute("style", style);
        this.ref.backlink = this;
		var bodyRef = document.getElementsByTagName("body").item(0);
        bodyRef.appendChild(this.ref);
	    this.ref.addEventListener("webkitTransitionEnd", this.iterationEnded, false);
	    this.ref.addEventListener("transitionend",this.iterationEnded, false);
	    this.ref.addEventListener("oTransitionEnd",this.iterationEnded, false);
    }
	this.direction = 1;
	this.bodyWidth = GetFloatValueOfAttr(document.body,'width');
	var _this = this;
	this.storePosition = function() {
	    _this.storeTimeout = setTimeout(_this.storePosition, 1000 / _this.nbMeasures);
	    var d = new Date();
	    var t = d.getTime() - _this.startTime;
		  var l = GetFloatValueOfAttr(_this.ref, 'left');
		  if(l){
	    	_this.values.push([t, l, _this.direction]);
		  }
	};
}

FPSMeter.prototype.run = function(itr) {
	this.maxIterations = itr?itr:NB_ITERATIONS;
	this.startTest(TARGET_FRAMES);
}

FPSMeter.prototype.startTest = function(targetFPS) {
  this.curIterations = 0;
  this.nbMeasures = targetFPS;
 	this.fpsValues = new Array();
  this.startIteration();
	this.storePosition();
}

FPSMeter.prototype.startIteration = function() {
  	this.values = new Array();
    var d = new Date();
    this.startTime = d.getTime();
    if (this.ref.style.left == "0px") {
        this.direction = 1;
        this.ref.style.left = this.bodyWidth + "px";
    } else {
        this.direction = -1;
        this.ref.style.left = "0px";
    }	
}

FPSMeter.prototype.iterationEnded = function(evt) {
	var _this = this.backlink;
    _this.curIterations++;
    clearTimeout(_this.storeTimeout);
    _this.storeTimeout = null;
    _this.storeFPS();
    if (_this.curIterations < _this.maxIterations) {
        _this.direction = (_this.direction == 1) ? -1 : 1;
        _this.startIteration();
        _this.storePosition();
    } else {
        _this.endTest();
    }
}

FPSMeter.prototype.storeFPS = function() {
    // Get valid frames (ie remove duplicates within last second)
    var fps = this.getValidFrames();
    this.fpsValues.push(fps);
    this.progress(fps);
}

FPSMeter.prototype.endTest = function() {
    var worstFPS = this.fpsValues[0];
    var bestFPS = this.fpsValues[0];
    var avgFPS = this.fpsValues[0];
    for (var i = 1; i < this.fpsValues.length; i++) {
        avgFPS += this.fpsValues[i];
        worstFPS = Math.min(worstFPS,this.fpsValues[i]);
        bestFPS = Math.max(bestFPS,this.fpsValues[i]);
    }
    if((this.fpsValues.length)>2){
      avgFPS = Math.round((avgFPS-worstFPS-bestFPS)/(this.fpsValues.length-2));
    }else{
      avgFPS = Math.round(avgFPS/this.fpsValues.length);
    }
    this.end(avgFPS,worstFPS,bestFPS);
}

FPSMeter.prototype.getValidFrames = function() {
    var duplicates = 0;
    var current = -1;
    for (var i = 0; i < this.values.length; i++) {
        var l = this.values[i][1];
        if (l == current) {
            duplicates++;
        } else {
            current = l;
        }
    }
    return (this.values.length - duplicates);
}

function GetFloatValueOfAttr (element,attr) {
    var floatValue = null;
    if (window.getComputedStyle) {
        var compStyle = window.getComputedStyle (element, null);
        try {
            var value = compStyle.getPropertyCSSValue (attr);
            var valueType = value.primitiveType;
            switch (valueType) {
              case CSSPrimitiveValue.CSS_NUMBER:
                  floatValue = value.getFloatValue (CSSPrimitiveValue.CSS_NUMBER);
                  break;
              case CSSPrimitiveValue.CSS_PERCENTAGE:
                  floatValue = value.getFloatValue (CSSPrimitiveValue.CSS_PERCENTAGE);
                  alert ("The value of the width property: " + floatValue + "%");
                  break;
              default:
                  if (CSSPrimitiveValue.CSS_EMS <= valueType && valueType <= CSSPrimitiveValue.CSS_DIMENSION) {
                      floatValue = value.getFloatValue (CSSPrimitiveValue.CSS_PX);
                  }
            }
        } 
        catch (e) {
          // Opera doesn't support the getPropertyCSSValue method
          stringValue = compStyle[attr];
          floatValue = stringValue.substring(0, stringValue.length - 2);
        }
    }
    return floatValue;
}
