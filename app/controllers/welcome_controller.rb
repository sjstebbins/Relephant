class WelcomeController < ApplicationController


  def homepage
    if user_signed_in?
      redirect_to( current_user )
    else
      redirect_to( welcome_path )
    end
  end

  def welcome
  end

end
