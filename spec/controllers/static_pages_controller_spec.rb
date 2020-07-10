require 'rails_helper'

RSpec.describe StaticPagesController, type: :controller do
  describe "entries#index" do
    it "should redirect to the login page when trying to view the index but not logged in" do
      get :index
      expect(response).to redirect_to new_user_session_path
    end

    it "should successfully show the index page when a user is logged in" do
      user = FactoryBot.create(:user)
      sign_in user
      get :index
      expect(response).to have_http_status(:success)
    end
  end
end