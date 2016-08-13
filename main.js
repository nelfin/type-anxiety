function countdown(bar, duration) {
  var updateInterval = 200;
  var updates = duration * (1000 / updateInterval);
  var timeRemaining = updates;
  setInterval(function() {
    bar.value = timeRemaining / updates;
    if (--timeRemaining < 0) {
      timeRemaining = 0;
    }
  }, updateInterval);
}

window.onload = function() {
  var bar = document.getElementById('anxiety-bar');
  countdown(bar, 30);
};
