class UsersController < ApplicationController
  before_action :authenticate_user!

  def show
    render json: User.find_by_id(current_user.id)
  end

  def update
    user = User.find_by_id(current_user.id)
    return render_not_found if user.blank?
    return render_not_found(:forbidden) if user != current_user
    user.update_attributes(user_params)
    if user.valid?
      redirect_to root_path
    else
      redirect_to root_path, alert: 'Your current balance could not be updated'
    end
  end

  def user_params
    params.require(:user).permit(:firstname, :lastname, :email, :current_balance, :months_to_display)
  end
end