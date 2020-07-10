require 'rails_helper'

RSpec.describe EntriesController, type: :controller do
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

  describe "entries#create" do
    it "should successfully create a new entry in our database" do
      user = FactoryBot.create(:user)
      sign_in user
      post :create, params: { 
        entry: {
          date: "2020-12-31",
          description: "Test create action",
          frequency: "one_time",
          amount: 6789
        } 
      }
      expect(response).to redirect_to root_path
      entry = Entry.last
      expect(entry.date).to eq("2020-12-31".to_date)
      expect(entry.description).to eq("Test create action")
      expect(entry.frequency).to eq("one_time")
      expect(entry.amount).to eq(6789)
      expect(entry.user).to eq(user)
    end

    it "should require a user to be logged in to create an entry" do
      post :create, params: { 
        entry: {
          date: "2020-12-31",
          description: "Test create action",
          frequency: "one_time",
          amount: 6789
        } 
      }
      expect(response).to redirect_to new_user_session_path
    end

    it "should properly deal with validation errors if date is blank" do
      user = FactoryBot.create(:user)
      sign_in user
      entry_count = Entry.count
      post :create, params: { 
        entry: {
          date: "",
          description: "Test create action",
          frequency: "one_time",
          amount: 6789
        } 
      }
      expect(response).to have_http_status(:unprocessable_entity)
      expect(entry_count).to eq(Entry.count)
    end

    # it "should properly deal with validation errors if date is before today" do
    #   user = FactoryBot.create(:user)
    #   sign_in user
    #   post :create, params: { 
    #     entry: {
    #       date: "2020-07-08",
    #       description: "Test create action",
    #       frequency: "one_time",
    #       amount: 6789
    #     } 
    #   }
    #   entry = Entry.last
    #   expect(entry.date < Date.today).to eq(true)
    #   expect(response).to have_http_status(:unprocessable_entity)
    # end

    it "should properly deal with validation errors if description is blank" do
      user = FactoryBot.create(:user)
      sign_in user
      post :create, params: { 
        entry: {
          date: "2020-12-31",
          description: "",
          frequency: "one_time",
          amount: 6789
        } 
      }
      expect(response).to have_http_status(:unprocessable_entity)
      expect(Entry.count).to eq 0
    end

    it "should properly deal with validation errors if description is longer than 64 characters" do
      user = FactoryBot.create(:user)
      sign_in user
      post :create, params: { 
        entry: {
          date: "2020-12-31",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit placerat.",
          frequency: "one_time",
          amount: 6789
        } 
      }
      expect(response).to have_http_status(:unprocessable_entity)
      expect(Entry.count).to eq 0
    end

    it "should properly deal with validation errors if frequency is blank" do
      user = FactoryBot.create(:user)
      sign_in user
      post :create, params: { 
        entry: {
          date: "2020-12-31",
          description: "Test create action",
          frequency: "",
          amount: 6789
        } 
      }
      expect(response).to have_http_status(:unprocessable_entity)
      expect(Entry.count).to eq 0
    end

    it "should properly deal with validation errors if frequency is blank" do
      user = FactoryBot.create(:user)
      sign_in user
      post :create, params: { 
        entry: {
          date: "2020-12-31",
          description: "Test create action",
          frequency: "one_time",
          amount: nil
        } 
      }
      expect(response).to have_http_status(:unprocessable_entity)
      expect(Entry.count).to eq 0
    end
  end
end