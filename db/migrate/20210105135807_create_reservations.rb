class CreateReservations < ActiveRecord::Migration[5.1]
  def change
    create_table :reservations do |t|
      t.integer :user_id
      t.datetime :start_date
      t.datetime :end_date
      t.jsonb :services
      t.integer :status
      t.string :description
    end
  end
end
