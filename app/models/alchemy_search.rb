class AlchemySearch


  def self.fetch_entities(words)
    alchemy = "9ddce0957447a5027cf1a73b860383823614057f";
    entities = HTTParty.get("http://access.alchemyapi.com/calls/text/TextGetRankedNamedEntities?outputMode=json&text=#{words}&apikey=#{alchemy}")
    entities = entities['entities']
  end


end
