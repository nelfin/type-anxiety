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

TextBox.prototype.getValue = function() {
  return this.textArea.value;
};

TextBox.prototype.setValue = function(v) {
  this.textArea.value = v;
};

TextBox.prototype.save = function(anchor) {
  var blob = new Blob([this.textArea.value], {type: "text/plain"});
  anchor.href = URL.createObjectURL(blob);
};

TextBox.prototype.length = function() {
  return this.getValue().length;
};

function autosave(source, destination, seconds) {
  var saveMillis = seconds * 1000;
  setInterval(function() {
    var text = source.getValue();
    if (text) {  // don't ovewrite saved with nothing
      destination.setValue(text);
    }
  }, saveMillis);
}

var Counter = function(span) {
  this.span = span;
  this.value = 0;
};

Counter.prototype.set = function(v) {
  this.value = v;
  this.span.innerHTML = this.value;
};

Counter.prototype.reset = function() {
  this.value = 0;
  this.span.innerHTML = this.value;
};

window.onload = function() {
  var bar = new Bar(30, document.getElementById('anxiety-bar'));
  var saved = new TextBox(document.getElementById('saved'));
  var draft = new TextBox(document.getElementById('draft'));
  var saveLink = document.getElementById('download-link');
  var chars = new Counter(document.getElementById('chars'));
  draft.setKeyup(function() {
    bar.reset();
    chars.set(draft.length());
  });
  bar.setOnZero(function() {
    draft.clear();
    chars.reset();
  });
  saveLink.onclick = function() {
    saved.setValue(draft.getValue());
    saved.save(saveLink);
  };
  autosave(draft, saved, 60);
  countdown(bar, 200);
};
