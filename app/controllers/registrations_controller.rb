class RegistrationsController < Devise::RegistrationsController

  private

  def sign_up_params
    params.require(:user).permit(:firstname, :lastname, :email, :password, :password_confirmation, :current_balance, :time_zone_id)
  end

  def account_update_params
    params.require(:user).permit(:firstname, :lastname, :email, :password, :password_confirmation, :current_password, :current_balance, :time_zone_id)
  end
end
