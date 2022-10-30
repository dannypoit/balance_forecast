class CreateVerticalSpacings < ActiveRecord::Migration[6.0]
  def change
    create_table :vertical_spacings do |t|
      t.string :padding

      t.timestamps
    end
  end
end
