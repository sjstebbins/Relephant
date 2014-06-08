class UsersController < ApplicationController
  before_action :authenticate_user!

  def show
    redirect_to current_user if current_user.id != params[:id].to_i
  end

end
