class CrunchbaseSearch

  def self.fetch_results(query)
    query.gsub!('+', '-')
    response = HTTParty.get("http://api.crunchbase.com/v/2/organization/#{query}?user_key=#{ENV['CRUNCHBASE_USER_KEY']}")
  end

end
