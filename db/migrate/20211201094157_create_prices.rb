class CreatePrices < ActiveRecord::Migration[5.1]
  def change
    create_table :prices do |t|
      t.decimal :water_price
      t.decimal :sewerage_price
      t.timestamps null: false
    end
  end
end
