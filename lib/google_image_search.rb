module GoogleImageSearch

  def self.fetch_results(entity)
    HTTParty.get("https://www.googleapis.com/customsearch/v1?key=#{ENV['RELEPHANT_GOOGLE_KEY']}&cx=015698937417642655162:-drsz93czku&q=#{entity}&searchType=image")
  end

end
