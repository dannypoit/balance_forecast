class AddMonthsToDisplayToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :months_to_display, :integer
  end
end
