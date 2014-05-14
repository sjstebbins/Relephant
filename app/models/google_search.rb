class GoogleSearch

  def self.fetch_results(entity)
    google= "AIzaSyD1NWvixbIxmWtt2AMm7Ku64rOJUkdSCXk";
    response = HTTParty.get("https://www.googleapis.com/customsearch/v1?key=#{google}&cx=015698937417642655162:-drsz93czku&q=#{entity}")
    return response
  end


end
