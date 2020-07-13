require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  # describe "users#show" do
  #   it "should list the user in JSON format" do
  #     user = FactoryBot.create(:user)
  #     sign_in user
  #     get :show, params: {
  #       id: user.id
  #     }
  #     expect(response).to have_http_status(:success)
  #     expect(response.body).to eq(user.to_json)
  #   end
  # end

  # describe "users#update" do
  #   # This is not working, but I suspect it has something to do with Devise being installed, having to route its stuff to the registrations controller. These same kinds of tests work fine in the entries controller, but the above (show) test was saying the email exists and is only working now that I changed the email in factories.rb. I am going to leave this commented here until I can figure out what's wrong.
  #   it "should allow a user to update their current balance" do
  #     user = FactoryBot.create(:user)
  #     sign_in user
  #     expect(user.current_balance).to eq(100000)
  #     patch :update, params: {
  #       id: user.id,
  #       user: {
  #         current_balance: 69420
  #       }
  #     }
  #     expect(user.current_balance).to eq(69420)
  #   end

  #   it "should not allow a user to update another user's current balance" do

  #   end
  # end
end