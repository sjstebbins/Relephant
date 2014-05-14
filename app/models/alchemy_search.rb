class AlchemySearch

  def self.fetch_entities(url)
    alchemy = "9ddce0957447a5027cf1a73b860383823614057f";
    alchemy_response = HTTParty.get("http://access.alchemyapi.com/calls/url/URLGetRankedNamedEntities?outputMode=json&url=#{url}&apikey=#{alchemy}")
  end

end
