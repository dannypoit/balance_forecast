require 'rails_helper'

RSpec.describe EntriesController, type: :controller do
  describe "entries#index" do
    it "should list the entries in the database" do
      entry1 = FactoryBot.create(:entry)
      entry2 = FactoryBot.create(:entry)
      get :index
      expect(response).to have_http_status(:success)
      response_value = ActiveSupport::JSON.decode(@response.body)
      expect(response_value.count).to eq(2)
    end
  end
end