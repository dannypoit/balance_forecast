class AddCurrentBalanceToUsersAsDecimal < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :current_balance, :decimal
  end
end
