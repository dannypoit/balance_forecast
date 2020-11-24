class AddTestDecimalToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :test_decimal, :decimal
  end
end
