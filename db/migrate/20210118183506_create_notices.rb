class CreateNotices < ActiveRecord::Migration[5.1]
  def change
    create_table :notices do |t|
      t.string :body
      t.date :date
      t.timestamps null: false
    end
  end
end
