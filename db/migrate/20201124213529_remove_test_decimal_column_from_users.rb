class RemoveTestDecimalColumnFromUsers < ActiveRecord::Migration[5.0]
  def change
    remove_column :users, :test_decimal
  end
end
