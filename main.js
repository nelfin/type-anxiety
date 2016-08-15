"use strict";

var Bar = function(max, progressElem) {
  this.value = max;
  this.max = max;
  this.elem = progressElem;
  this.onZero = function(){};
};

Bar.prototype.setOnZero = function(f) {
  this.onZero = f;
};

Bar.prototype.decrement = function(v) {
  if (this.value <= v) {
    this.value = 0;
    this.onZero();
  } else {
    this.value -= v;
  }
  this.elem.value = this.value/this.max;
};

Bar.prototype.reset = function() {
  this.value = this.max;
  this.elem.value = 1;
};

function countdown(bar, updateIntervalMillis) {
  var update = updateIntervalMillis / 1000;
  setInterval(function() {
    bar.decrement(update);
  }, updateIntervalMillis);
}

var TextBox = function(textArea) {
  this.textArea = textArea;
};

TextBox.prototype.clear = function() {
  this.textArea.value = "";
};

TextBox.prototype.setKeyup = function(f) {
  this.textArea.onkeyup = f;
};

window.onload = function() {
  var bar = new Bar(30, document.getElementById('anxiety-bar'));
  var textBox = new TextBox(document.getElementById('draft'));
  textBox.setKeyup(function() {
    bar.reset();
  });
  bar.setOnZero(function() {
    textBox.clear();
  });
  countdown(bar, 200);
};
