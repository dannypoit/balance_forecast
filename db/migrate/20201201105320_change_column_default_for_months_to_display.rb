class ChangeColumnDefaultForMonthsToDisplay < ActiveRecord::Migration[5.0]
  def change
    change_column_default :users, :months_to_display, 3
  end
end
