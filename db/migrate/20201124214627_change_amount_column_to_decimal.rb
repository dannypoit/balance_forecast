class ChangeAmountColumnToDecimal < ActiveRecord::Migration[5.0]
  def change
    change_column :entries, :amount, :decimal, precision: 10, scale: 2
  end
end
