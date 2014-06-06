module AlchemySearch

  def self.fetch_entities(words)
    words.gsub!("+", " ")
    HTTParty.post("http://access.alchemyapi.com/calls/text/TextGetRankedNamedEntities",
                  :body => {
                            :outputMode => 'json',
                            :apikey => ENV['RELEPHANT_ALCHEMY_KEY'],
                            :text => words
                            })
  end

end
