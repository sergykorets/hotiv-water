class CreateHouses < ActiveRecord::Migration[5.1]
  def change
    create_table :houses do |t|
      t.string :name
      t.boolean :sewerage, default: false
      t.timestamps null: false
    end
  end
end
