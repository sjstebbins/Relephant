class AlchemySearch


  def self.fetch_entities(words)
    alchemy = "9ddce0957447a5027cf1a73b860383823614057f";
    alchemy_response = HTTParty.get("http://access.alchemyapi.com/calls/text/TextGetRankedNamedEntities?outputMode=json&text=#{words}&sentiment=1&apikey=#{alchemy}")
  end


end
