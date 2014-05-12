var SpeechInputView = Backbone.View.extend({
  el: '#speech-input',
  events: {
    'click #status_img':'startRecording'
  },
  startRecording: function(){
    console.log('hi');
    microphoneButton();
  }
});
