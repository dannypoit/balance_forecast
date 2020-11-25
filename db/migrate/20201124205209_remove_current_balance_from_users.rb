class RemoveCurrentBalanceFromUsers < ActiveRecord::Migration[5.0]
  def change
    remove_column :users, :current_balance
  end
end
