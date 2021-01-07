class CreateJoinTableReservationService < ActiveRecord::Migration[5.1]
  def change
    create_join_table :reservations, :services do |t|
      t.index [:reservation_id, :service_id]
      #t.index [:service_id, :reservation_id]
    end
  end
end
