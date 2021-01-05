class ReservationsController < ApplicationController

  def index
    @reservations = Reservation.current_month.each_with_object({}) {|reservation, hash| hash[reservation.id] = {
        id: reservation.id,
        status: reservation.status,
        description: reservation.description,
        startDate: reservation.start_date.strftime('%d.%m.%Y %H:%M'),
        endDate: reservation.end_date.strftime('%d.%m.%Y %H:%M')}
    }
    respond_to do |format|
      format.html { render :index }
      format.json {{reservations: @reservations }}
    end
  end

  private

  def reservation_params
    params.require(:product).permit()
  end
end