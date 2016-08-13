var Bar = function(max, progressElem) {
  this.value = max;
  this.max = max;
  this.elem = progressElem;
};

Bar.prototype.decrement = function(v) {
  this.value = Math.max(this.value-v, 0);
  this.elem.value = this.value/this.max;
};

function countdown(bar, updateIntervalMillis) {
  var update = updateIntervalMillis / 1000;
  setInterval(function() {
    bar.decrement(update);
  }, updateIntervalMillis);
}

window.onload = function() {
  var bar = new Bar(30, document.getElementById('anxiety-bar'));
  countdown(bar, 200);
};
