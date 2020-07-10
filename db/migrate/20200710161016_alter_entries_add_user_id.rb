class AlterEntriesAddUserId < ActiveRecord::Migration[5.0]
  def change
    add_column :entries, :user_id, :integer
    add_index :entries, :user_id
  end
end
