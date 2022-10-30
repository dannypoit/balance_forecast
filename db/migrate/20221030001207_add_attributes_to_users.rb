class AddAttributesToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :vertical_spacing_id, :integer
  end
end
