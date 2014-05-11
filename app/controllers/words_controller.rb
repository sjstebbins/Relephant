class WordsController < ApplicationController

  # Need authentication here for security?

  def index
    words = current_user.words
    respond_to do |format|
      format.html { }
      format.json { render json: words.to_json }
    end
  end

  def show
    word = Word.find(params[:id])
    respond_to do |format|
      format.html { }
      format.json { render json: word }
    end
  end

end
