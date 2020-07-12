require 'rails_helper'

RSpec.describe EntriesController, type: :controller do
  describe "entries#index" do
    it "should list the entries in the database" do
      user = FactoryBot.create(:user)
      sign_in user
      post :create, params: { 
        entry: {
          date: "2020-12-31",
          description: "Test entries index 1",
          frequency: "one_time",
          amount: 6789
        } 
      }
      entry1 = Entry.last
      post :create, params: { 
        entry: {
          date: "2020-12-31",
          description: "Test entries index 2",
          frequency: "one_time",
          amount: 6789
        } 
      }
      entry2 = Entry.last
      get :index
      expect(response).to have_http_status :success
      response_value = ActiveSupport::JSON.decode(@response.body)
      expect(response_value.count).to eq(2)
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
      # byebug
      post :create, params: { 
        entry: {
          date: "",
          description: "Test create action",
          frequency: "one_time",
          amount: 6789
        } 
      }
      expect(response).to redirect_to root_path
      expect(flash[:alert]).to be_present
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