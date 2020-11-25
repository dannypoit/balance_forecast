class ChangeCurrentBalanceToDecimal < ActiveRecord::Migration[5.0]
  def change
    change_column :users, :current_balance, :decimal
  end
end
