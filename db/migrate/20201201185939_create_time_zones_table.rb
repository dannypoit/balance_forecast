class CreateTimeZonesTable < ActiveRecord::Migration[5.0]
  def change
    create_table :time_zones_tables do |t|
      t.string :name
      t.string :description
      t.string :relative_to_gmt
    end
  end
end
