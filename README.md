Relephant
========

<img src="http://relephant.me/assets/logo-902d36263af54f7c5ca5ca1c77233d78.png">

App Description:

Relephant is a persistent memory tool with the capability of analyzing speech for meaning. Relephant provides users with the functionality to search their speech history, comb through past conversations for keywords, generate period transcripts, and search for the relevant concepts of an entire converstation.

How it Works:

Relephant is a Rails application. When users record, Relephant uses the Google Web speach API to convert speech to text and then sends ajax requests to its SQL database at set intervals that can be seen on the UI. These words recorded in that set interval are then stored to the user's account with a timestamp. The main graph is built on Rickshaw which is built on D3. The main UI utilizes jquery and jquery UI to achieve its animated qualities including the sliders and page scrolls.. When a user clicks on 'generate concepts', the entres within the that users account on thesql databse that are between the two jquery UI sliders are compiled and sent to alchemy to generate relevant concepts. When a user clicks on a concept, an ajax request to google maps is made using that concept. 

APIs used:

-Google Web Speech 
-Google CSE
-Google Maps
-Alchemy

Contributors:

Spencer Stebbins and Jesse Sessler

