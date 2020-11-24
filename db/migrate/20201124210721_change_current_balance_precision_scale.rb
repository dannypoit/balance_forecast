class ChangeCurrentBalancePrecisionScale < ActiveRecord::Migration[5.0]
  def change
    change_column :users, :current_balance, :decimal, precision: 10, scale: 2
  end
end
