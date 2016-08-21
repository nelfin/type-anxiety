(function() {
  'use strict';

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
    if (this.value > 0) {
      if (this.value <= v) {
        this.value = 0;
        this.onZero();
      } else {
        this.value -= v;
      }
    }
    this.elem.value = this.value/this.max;
  };

  Bar.prototype.reset = function() {
    this.value = this.max;
    this.elem.value = 1;  // 100%
  };

  var Counter = function(span) {
    this.span = span;
    this.value = 0;
  };

  Counter.prototype.set = function(v) {
    this.value = v;
    this.span.innerHTML = this.value;
  };

  Counter.prototype.reset = function() {
    this.set(0);
  };

  var PauseButton = function(elem) {
    this.paused = true;
    this.elem = elem;
  };

  PauseButton.prototype.setOnClick = function(f) {
    var that = this;
    this.elem.onclick = function() {
      that.elem.textContent = that.paused ? 'Resume' : 'Pause';
      that.paused = !that.paused;
      f(that.paused);
    };
  };

  var TextBox = function(textArea) {
    this.textArea = textArea;
  };

  TextBox.prototype.getValue = function() {
    return this.textArea.value;
  };

  TextBox.prototype.setValue = function(v) {
    this.textArea.value = v;
  };

  TextBox.prototype.clear = function() {
    this.setValue('');
  };

  TextBox.prototype.setKeyup = function(f) {
    this.textArea.onkeyup = f;
  };

  TextBox.prototype.save = function(anchor) {
    var blob = new Blob([this.getValue()], {type: 'text/plain'});
    anchor.href = URL.createObjectURL(blob);
  };

  TextBox.prototype.length = function() {
    return this.getValue().length;
  };

  TextBox.prototype.words = function() {
    var text = this.getValue();
    var spaces = /\s+/g;
    text.replace(spaces, ' ');
    text = text.trim();
    if (text === '') {
      return 0;
    } else {
      return text.split(spaces).length;
    }
  };

  var Timer = function(interval, task) {
    this.interval = interval;
    this.task = task;
    this.id = -1;
    this.paused = true;
  };

  Timer.prototype.start = function() {
    if (this.paused) {
      this.id = setInterval(this.task, this.interval);
      this.paused = false;
    }
  };

  Timer.prototype.stop = function() {
    if (!this.paused) {
      clearInterval(this.id);
      this.paused = true;
    }
  };

  var TimerGroup = function(timers) {
    this.timers = timers;
    this.paused = true;
  };

  TimerGroup.prototype.toggle = function() {
    var toggler = function(t) { t.stop(); };
    if (this.paused) {
      toggler = function(t) { t.start(); };
    }
    this.timers.map(toggler);
    this.paused = !this.paused;
  };

  function autosave(source, destination, seconds) {
    var saveMillis = seconds * 1000;
    return new Timer(saveMillis, function() {
      var text = source.getValue();
      if (text) {  // don't ovewrite saved with nothing
        destination.setValue(text);
      }
    });
  }

  function countdown(bar, updateIntervalMillis) {
    var update = updateIntervalMillis / 1000;
    return new Timer(updateIntervalMillis, function() {
      bar.decrement(update);
    });
  }

  window.onload = function() {
    var bar = new Bar(30, document.getElementById('anxiety-bar'));
    var saved = new TextBox(document.getElementById('saved'));
    var draft = new TextBox(document.getElementById('draft'));
    var saveLink = document.getElementById('download-link');
    var chars = new Counter(document.getElementById('chars'));
    var words = new Counter(document.getElementById('words'));

    bar.setOnZero(function() {
      draft.clear();
      chars.reset();
      words.reset();
    });
    draft.setKeyup(function() {
      bar.reset();
      chars.set(draft.length());
      words.set(draft.words());
    });
    saveLink.onclick = function() {
      saved.setValue(draft.getValue());
      saved.save(saveLink);
    };

    var timers = [autosave(draft, saved, 60), countdown(bar, 200)];
    var group = new TimerGroup(timers);
    var pauseButton = new PauseButton(document.getElementById('pause-button'));
    pauseButton.setOnClick(function() {
      group.toggle();
    });
    group.toggle();
  };
})();
