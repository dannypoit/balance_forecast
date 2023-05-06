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
          frequency: "one-time",
          amount: 6789
        } 
      }
      entry1 = Entry.last
      post :create, params: { 
        entry: {
          date: "2020-12-31",
          description: "Test entries index 2",
          frequency: "one-time",
          amount: 6789
        } 
      }
      entry2 = Entry.last
      entry1.update(description: "Arbitrary description update")
      get :index
      expect(response).to have_http_status(:success)
      response_value = ActiveSupport::JSON.decode(@response.body)
      expect(response_value.count).to eq(2)
      response_ids = response_value.collect do |entry|
        entry["id"]
      end
      expect(response_ids).to eq([entry1.id, entry2.id])
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
          frequency: "one-time",
          amount: 6789
        } 
      }
      expect(response).to redirect_to root_path
      entry = Entry.last
      expect(entry.date).to eq("2020-12-31".to_date)
      expect(entry.description).to eq("Test create action")
      expect(entry.frequency).to eq("one-time")
      expect(entry.amount).to eq(6789)
      expect(entry.user).to eq(user)
    end

    it "should require a user to be logged in to create an entry" do
      post :create, params: { 
        entry: {
          date: "2020-12-31",
          description: "Test create action",
          frequency: "one-time",
          amount: 6789
        } 
      }
      expect(response).to redirect_to new_user_session_path
    end

    it "should properly deal with validation errors if date is blank" do
      user = FactoryBot.create(:user)
      sign_in user
      post :create, params: { 
        entry: {
          date: "",
          description: "Test create action",
          frequency: "one-time",
          amount: 6789
        } 
      }
      expect(response).to redirect_to root_path
      expect(flash[:alert]).to be_present
      expect(Entry.count).to eq(0)
    end

    # it "should properly deal with validation errors if date is before today" do
    #   user = FactoryBot.create(:user)
    #   sign_in user
    #   post :create, params: { 
    #     entry: {
    #       date: "2020-07-08",
    #       description: "Test create action",
    #       frequency: "one-time",
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
          frequency: "one-time",
          amount: 6789
        } 
      }
      expect(response).to redirect_to root_path
      expect(flash[:alert]).to be_present
      expect(Entry.count).to eq(0)
    end

    it "should properly deal with validation errors if description is longer than 64 characters" do
      user = FactoryBot.create(:user)
      sign_in user
      post :create, params: { 
        entry: {
          date: "2020-12-31",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit placerat.",
          frequency: "one-time",
          amount: 6789
        } 
      }
      expect(response).to redirect_to root_path
      expect(flash[:alert]).to be_present
      expect(Entry.count).to eq(0)
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
      expect(response).to redirect_to root_path
      expect(flash[:alert]).to be_present
      expect(Entry.count).to eq(0)
    end

    it "should properly deal with validation errors if frequency is not valid" do
      user = FactoryBot.create(:user)
      sign_in user
      post :create, params: { 
        entry: {
          date: "2020-12-31",
          description: "Test create action",
          frequency: "Lady Gaga",
          amount: 6789
        } 
      }
      expect(response).to redirect_to root_path
      expect(flash[:alert]).to be_present
      expect(Entry.count).to eq(0)
    end

    it "should properly deal with validation errors if amount is blank" do
      user = FactoryBot.create(:user)
      sign_in user
      post :create, params: { 
        entry: {
          date: "2020-12-31",
          description: "Test create action",
          frequency: "one-time",
          amount: nil
        } 
      }
      expect(response).to redirect_to root_path
      expect(flash[:alert]).to be_present
      expect(Entry.count).to eq(0)
    end
  end

  describe "entries#update" do
    it "should require a user to be logged in to update an entry" do
      entry = FactoryBot.create(:entry)
      patch :update, params: {
        id: entry.id,
        entry: {
          description: "Update to entry"
        }
      }
      expect(response).to redirect_to new_user_session_path
    end

    it "should properly deal with validation errors if an entry is updated and date is blank" do
      entry = FactoryBot.create(:entry)
      sign_in entry.user
      patch :update, params: { 
        id: entry.id,
        entry: {
          date: ""
        } 
      }
      expect(response).to redirect_to root_path
      expect(flash[:alert]).to be_present
      last_entry = Entry.last
      expect(last_entry.date).to eq(entry.date)
    end

    # it "should properly deal with validation errors if an entry is updated and date is before today" do
    #   entry = FactoryBot.create(:entry)
    #   sign_in entry.user
    #   patch :update, params: { 
    #     id: entry.id,
    #     entry: {
    #       date: "2020-07-08"
    #     } 
    #   }
    #   last_entry = Entry.last
    #   expect(entry.date < Date.today).to eq(true)
    # end

    it "should properly deal with validation errors if an entry is updated and description is blank" do
      entry = FactoryBot.create(:entry)
      sign_in entry.user
      put :create, params: { 
        id: entry.id,
        entry: {
          description: ""
        } 
      }
      expect(response).to redirect_to root_path
      expect(flash[:alert]).to be_present
      last_entry = Entry.last
      expect(last_entry.description).to eq(entry.description)
    end

    it "should properly deal with validation errors if an entry is updated and description is longer than 64 characters" do
      entry = FactoryBot.create(:entry)
      sign_in entry.user
      patch :update, params: { 
        id: entry.id,
        entry: {
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit placerat."
        } 
      }
      expect(response).to redirect_to root_path
      expect(flash[:alert]).to be_present
      last_entry = Entry.last
      expect(last_entry.description).to eq(entry.description)
    end

    it "should properly deal with validation errors if an entry is updated and frequency is blank" do
      entry = FactoryBot.create(:entry)
      sign_in entry.user
      patch :update, params: { 
        id: entry.id,
        entry: {
          frequency: ""
        } 
      }
      expect(response).to redirect_to root_path
      expect(flash[:alert]).to be_present
      last_entry = Entry.last
      expect(last_entry.frequency).to eq(entry.frequency)
    end

    it "should properly deal with validation errors if an entry is updated and amount is blank" do
      entry = FactoryBot.create(:entry)
      sign_in entry.user
      patch :update, params: { 
        id: entry.id, 
        entry: {
          date: ""
        } 
      }
      expect(response).to redirect_to root_path
      expect(flash[:alert]).to be_present
      last_entry = Entry.last
      expect(last_entry.date).to eq(entry.date)
    end
    
    it "should allow a user to update the date in an entry they created" do
      entry = FactoryBot.create(:entry)
      sign_in entry.user
      patch :update, params: {
        id: entry.id,
        entry: {
          date: "2020-08-02"
        }
      }
      expect(response).to have_http_status(:success)
      entry.reload
      expect(entry.date).to eq("2020-08-02".to_date)
    end

    it "should allow a user to update the description in an entry they created" do
      entry = FactoryBot.create(:entry)
      sign_in entry.user
      patch :update, params: {
        id: entry.id,
        entry: {
          description: "Updated description"
        }
      }
      expect(response).to have_http_status(:success)
      entry.reload
      expect(entry.description).to eq("Updated description")
    end

    it "should allow a user to update the frequency in an entry they created" do
      entry = FactoryBot.create(:entry)
      sign_in entry.user
      patch :update, params: {
        id: entry.id,
        entry: {
          frequency: "bi-weekly"
        }
      }
      expect(response).to have_http_status(:success)
      entry.reload
      expect(entry.frequency).to eq("bi-weekly")
    end

    it "should allow a user to update the amount in an entry they created" do
      entry = FactoryBot.create(:entry)
      sign_in entry.user
      patch :update, params: {
        id: entry.id,
        entry: {
          amount: 69420
        }
      }
      expect(response).to have_http_status(:success)
      entry.reload
      expect(entry.amount).to eq(69420)
    end

    it "should return a 404 not found error if a user tries to update an entry that does not exist" do
      user = FactoryBot.create(:user)
      sign_in user
      patch :update, params: {
        id: 'MANHORSE',
        entry: {
          amount: 69420
        }
      }
      expect(response).to have_http_status(:not_found)
    end

    it "should not allow a user to update an entry that belongs to another user" do
      entry = FactoryBot.create(:entry)
      user = FactoryBot.create(:user)
      sign_in user
      patch :update, params: {
        id: entry.id,
        entry: {
          amount: 69420
        }
      }
      expect(response).to have_http_status(:forbidden)
    end
  end

  describe "entries#destroy action" do
    it "should not let unauthenticated users destroy an entry" do
      entry = FactoryBot.create(:entry)
      delete :destroy, params: {
        id: entry.id
      }
      expect(response).to redirect_to new_user_session_path
    end

    it "should allow a user to destroy an entry they created" do
      entry = FactoryBot.create(:entry)
      expect(Entry.count).to eq(1)
      expect(Entry.last).to eq(entry)
      sign_in entry.user
      delete :destroy, params: {
        id: entry.id
      }
      expect(response).to redirect_to root_path
      expect(Entry.count).to eq(0)
      expect(Entry.last).not_to eq(entry)
    end

    it "should not allow a user to destroy an entry they did not create" do
      entry = FactoryBot.create(:entry)
      expect(Entry.count).to eq(1)
      expect(Entry.last).to eq(entry)
      user = FactoryBot.create(:user)
      sign_in user
      delete :destroy, params: {
        id: entry.id
      }
      expect(response).to have_http_status(:forbidden)
      expect(Entry.count).to eq(1)
      expect(Entry.last).to eq(entry)
    end

    it "should return a 404 error if a user tries to destroy an entry that does not exist" do
      user = FactoryBot.create(:user)
      sign_in user
      delete :destroy, params: {
        id: 'MANHORSE'
      }
      expect(response).to have_http_status(:not_found)
    end
  end
end