class WordsController < ApplicationController

  def index
    words = current_user.words
    respond_to do |format|
      format.html { }
      format.json { render json: words.to_json }
    end
  end

  def alchemy_search
    words = params[:words]
    words.gsub!("+", " ")
    response = AlchemySearch.fetch_entities(words);
    respond_to do |format|
      format.html { }
      format.json { render json: response.to_json }
    end
  end

  def google_search
    entity = params[:entity]
    response = GoogleSearch.fetch_results(entity)
    respond_to do |format|
      format.html { }
      format.json { render json: response.to_json }
    end
  end

  def crunchbase_search
    query = params[:query]
    response = CrunchbaseSearch.fetch_results(query)
    respond_to do |format|
      format.html { }
      format.json { render json: response.to_json }
    end
  end

  def show
    word = Word.find(params[:id])
    respond_to do |format|
      format.html { }
      format.json { render json: word.to_json }
    end
  end

  def create
    word = current_user.words.create(word_params)
    respond_to do |format|
      format.html { }
      format.json { render json: word.to_json}
    end
  end

  private

  def word_params
    params.require(:word).permit(:letters)
  end

end
