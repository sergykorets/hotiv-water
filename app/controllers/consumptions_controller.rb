class ConsumptionsController < ApplicationController
  def create
    consumption = Consumption.new(consumption_params)
    consumption.with_lock do
      if consumption.save
        consumptions = consumption.flat.consumptions.for_year(Time.new.year)
        total_paid = consumptions.paid.sum(:water_price) + consumptions.paid.sum(:sewerage_price)
        total_owe = consumptions.not_paid.sum(:water_price) + consumptions.not_paid.sum(:sewerage_price)
        render json: { success: true,
                       consumptions: consumptions.order("date DESC"),
                       total_paid: total_paid,
                       total_owe: total_owe
        }
      else
        render json: {success: false, error: consumption.errors.full_messages}
      end
    end
  end

  def update
    consumption = Consumption.find(params[:id])
    if consumption.update(consumption_params)
      consumptions = consumption.flat.consumptions.for_year(Time.new.year)
      total_paid = consumptions.paid.sum(:water_price) + consumptions.paid.sum(:sewerage_price)
      total_owe = consumptions.not_paid.sum(:water_price) + consumptions.not_paid.sum(:sewerage_price)
      render json: { success: true,
                     consumptions: consumptions.order("date DESC"),
                     total_paid: total_paid,
                     total_owe: total_owe
      }
    else
      render json: { success: false, error: consumption.errors.full_messages }
    end
  end

  private

  def consumption_params
    params.require(:consumption).permit(:water, :date, :status, :flat_id)
  end
end