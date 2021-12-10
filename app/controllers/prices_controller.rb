class PricesController < ApplicationController

  def index
    @price = Price.first
    respond_to do |format|
      format.html { render :index }
      format.json {{success: true, price: @price}}
    end
  end

  def update
    price = Price.first
    if price.update(price_params)
      render json: { success: true, price: price }
    else
      render json: { success: false, error: price.errors.full_messages }
    end
  end

  private

  def price_params
    params.require(:price).permit(:water_price, :sewerage_price)
  end
end