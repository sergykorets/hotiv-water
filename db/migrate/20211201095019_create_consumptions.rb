class CreateConsumptions < ActiveRecord::Migration[5.1]
  def change
    create_table :consumptions do |t|
      t.decimal :water
      t.decimal :water_price
      t.decimal :sewerage_price, default: 0
      t.integer :status, default: 0
      t.datetime :date
      t.integer :flat_id, index: true
      t.timestamps null: false
    end
  end
end
