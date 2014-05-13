// Global namespace pollution?
var reco = new WebSpeechRecognition();

var SpeechInputView = Backbone.View.extend({
  el: '#speech-input',
  events: {
    'click button#microphone':'microphoneButton'
  },
  initialize: function(){
    this.wordStorage = [];

    //setup webspeech and custom listeners
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
            _.each(indivWords, function(word, index){
              this.wordStorage.push(word);
            }.bind(this));
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }
      document.getElementById('interim_span').innerHTML = interim_transcript;
    }.bind(this);

    //begin listening every for word additions
    this.listenForWords();
  },
  microphoneButton: function(){
    reco.toggleStartStop();
  },
  listenForWords: function(){
    var interval = setInterval(function(){
      _.each(this.wordStorage, function(word, index){
        var newWord = {letters: word};
        this.collection.create(newWord, {wait: true});
      }.bind(this));
      this.wordStorage = [];
    }.bind(this), 5000);
  }
});
