class ChangeCurrentBalanceDefaultAgain < ActiveRecord::Migration[5.0]
  def change
    change_column :users, :current_balance, :decimal, default: 0, precision: 10, scale: 2
  end
end
