class AlchemySearch

  def self.fetch_entities(url)
    sleep(2)
    alchemy = "9ddce0957447a5027cf1a73b860383823614057f";
    HTTParty.get("http://access.alchemyapi.com/calls/url/URLGetRankedNamedEntities?outputMode=json&url=#{url}&sentiment=1&apikey=#{alchemy}")
  end

end
