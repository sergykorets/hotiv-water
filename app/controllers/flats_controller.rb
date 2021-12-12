class FlatsController < ApplicationController
  before_action :check_admin
  def index
    @houses = House.all
    respond_to do |format|
      format.html { render :index }
      format.json {{success: true, houses: @houses}}
    end
  end

  def show
    @flat = Flat.find(params[:id])
    @consumptions = Consumption.where(flat: @flat).for_year(params[:year]).order("date DESC")
    @total_paid = @consumptions.paid.sum(:water_price) + @consumptions.paid.sum(:sewerage_price)
    @total_owe = @consumptions.not_paid.sum(:water_price) + @consumptions.not_paid.sum(:sewerage_price)
    @house = @flat.house
    respond_to do |format|
      format.html { render :show }
      format.json
    end
  end

  def create
    flat = Flat.new(flat_params)
    if flat.save
      render json: { success: true, flats: flat.house.flats }
    else
      render json: {success: false, error: flat.errors.full_messages}
    end
  end

  def update
    flat = Flat.find(params[:id])
    if flat.update(flat_params)
      render json: { success: true, flats: flat.house.flats }
    else
      render json: { success: false, error: flat.errors.full_messages }
    end
  end

  def destroy
    flat = Flat.find(params[:id])
    if flat.destroy
      render json: { success: true, flats: flat.house.flats }
    else
      render json: {success: false, error: flat.errors.full_messages}
    end
  end

  private

  def flat_params
    params.require(:flat).permit(:name, :owner, :phone, :house_id)
  end
end