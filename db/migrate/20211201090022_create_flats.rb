class CreateFlats < ActiveRecord::Migration[5.1]
  def change
    create_table :flats do |t|
      t.string :name
      t.string :owner
      t.string :phone
      t.integer :house_id, index: true
      t.boolean :sewerage, default: false
      t.timestamps null: false
    end
  end
end
