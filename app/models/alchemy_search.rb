class AlchemySearch

  def self.fetch_entities(words)
    alchemy = "9ddce0957447a5027cf1a73b860383823614057f";
    words.gsub!("+", " ")
    HTTParty.post("http://access.alchemyapi.com/calls/text/TextGetRankedNamedEntities",
                  :body => {
                            :outputMode => 'json',
                            :apikey => alchemy,
                            :text => words
                            })
  end

end
