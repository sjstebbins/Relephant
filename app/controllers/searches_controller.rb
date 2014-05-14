class SearchesController < ApplicationController

  def show
    @search = Search.find(params[:id])
    render layout: false
  end

  def alchemy_search
    words = params[:words]
    words.gsub!("+", " ")
    search = Search.create(content: words);
    response = AlchemySearch::fetch_entities(url_for(search));
    # search.destroy
    respond_to do |format|
      format.html { }
      format.json { render json: response.to_json }
    end
  end

end
