class AddFrequencyToEntries < ActiveRecord::Migration[5.0]
  def change
    add_column :entries, :frequency, :string
  end
end
