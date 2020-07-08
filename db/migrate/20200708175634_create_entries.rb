class CreateEntries < ActiveRecord::Migration[5.0]
  def change
    create_table :entries do |t|
      t.date :date
      t.string :description
      t.integer :amount
      t.timestamps
    end
  end
end
