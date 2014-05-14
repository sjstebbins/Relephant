class AlchemySearch

  def self.fetch_entities(url)
    alchemy = "9ddce0957447a5027cf1a73b860383823614057f";
    alchemy_response = HTTParty.get("http://access.alchemyapi.com/calls/url/URLGetRankedNamedEntities?outputMode=json&url=http://www.nytimes.com/2014/05/14/nyregion/newark-mayoral-race.html?hp&_r=0&sentiment=1&apikey=#{alchemy}")
  end

end
