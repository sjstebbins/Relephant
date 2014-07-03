var SpeechInputView = Backbone.View.extend({
  el: '#speech-input',

  events: {
    'click button#microphone':'microphoneButton'
  },

  initialize: function(options){
    this.options = options || {};

    // reset
    $('#microphone').nextAll().remove();

    // setup dummy/placeholder vars
    this.tempWordStorage = [];
    this.prevAlchemyWordString = '';
    this.curAlchemyWordString = '';

    // setup webspeech and webspeech listeners
    reco.statusText('status');
    reco.statusImage('status_img');
    reco.finalResults('final_span');
    reco.interimResults('interim_span');
    reco.continuous = true;
    reco.maxAlternatives = 1;

    reco.recognition.onresult = function(event) {
      var interim_transcript = '';
      // Process all new results, both final and interim.
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          var indivWords = event.results[i][0].transcript.trim().split(" ");
        // add period to last word in block of words for alchemy recognition purposes
          indivWords[indivWords.length - 1] += ".";
          _.each(indivWords, function(word, index){
            this.tempWordStorage.push(word);
            this.curAlchemyWordString += (word + " ");
          }.bind(this));
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      document.getElementById('interim_span').innerHTML = interim_transcript;
    }.bind(this);

    // begin listening every for word additions
    this.listenForWords();

    // if live mode, render alchemy results on an interval
    if (this.options.liveMode) {
      this.setPlaceHolder();
      this.setQueryInterval();
      reco.toggleStartStop();
    }
  },

  microphoneButton: function(){
    reco.toggleStartStop();
  },

  listenForWords: function(){
    var currentListenInterval = setInterval(function(){
      if (this.tempWordStorage.length > 0) {
        for (var i = 0; i < this.tempWordStorage.length; i++) {
          var newWord = {letters: this.tempWordStorage[i]};
          this.collection.create(newWord);
        }
      this.tempWordStorage = [];
      }
    }.bind(this), 2000);
  },

  setQueryInterval: function(){
    clearInterval(this.currentQueryInterval);
    this.currentQueryInterval = setInterval(function(){
      if (this.curAlchemyWordString !== '' && this.prevAlchemyWordString !== this.curAlchemyWordString) {
        $('#placeholder').remove();
        this.prevAlchemyWordString = this.curAlchemyWordString;
        this.renderAlchemyView(this.curAlchemyWordString);
      }
    }.bind(this), 5000);
  },

  displayNoSpeechError: function(){
    $('#RelephantError').remove();
    this.$el.append('<div id="RelephantError">No words detected, please continue speaking</div>');
  },

  renderAlchemyView: function(){
    new AlchemyResultsView({stringToQuery: this.curAlchemyWordString, liveMode: true});
  },

  setPlaceHolder: function(){
    this.$el.append('<div id="placeholder"><img src="http://i.imgur.com/c1ZAaYq.png" /><h3>Please continue speaking</h3></div>');
  },

  close: function(){
    clearInterval(this.currentQueryInterval);
    clearInterval(this.currentListenInterval);
  }
});
