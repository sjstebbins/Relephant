class WordsController < ApplicationController
  # Need authentication here for security?

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

  def show
    word = Word.find(params[:id])
    respond_to do |format|
      format.html { }
      format.json { render json: word.to_json }
    end
  end

  def create
    word = current_user.words.create(word_params)
    # word = Word.find_or_create_by(word_params) # Cant do this way because every word is unique
    # even if word is same litters, the created_at times are different
    # use part of speech gem here
    # use callback for next line?
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
