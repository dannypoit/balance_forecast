class AddCurrentBalanceToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :current_balance, :integer, default: 0
  end
end
