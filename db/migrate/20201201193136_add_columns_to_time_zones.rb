class AddColumnsToTimeZones < ActiveRecord::Migration[5.0]
  def change
    add_column :time_zones, :name, :string
    add_column :time_zones, :description, :string
    add_column :time_zones, :relative_to_gmt, :string
  end
end
