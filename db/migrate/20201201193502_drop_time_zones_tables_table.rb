class DropTimeZonesTablesTable < ActiveRecord::Migration[5.0]
  def change
    drop_table :time_zones_tables
  end
end
