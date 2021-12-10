class HousesController < ApplicationController

  def index
    @houses = House.all.order(:created_at)
    respond_to do |format|
      format.html { render :index }
      format.json {{success: true, houses: @houses}}
    end
  end

  def show
    @house = House.find(params[:id])
    @flats = @house.flats.map do |flat|
      { id:     flat.id,
        name:   flat.name,
        owner:  flat.owner,
        phone:  flat.phone,
        status: flat.consumptions.pluck(:status).any?('not_paid') }
    end
    respond_to do |format|
      format.html { render :show }
      format.json {{success: true, house: @house, flats: @flats}}
    end
  end

  def create
    house = House.new(house_params)
    if house.save
      render json: { success: true, houses: House.all }
    else
      render json: {success: false, error: house.errors.full_messages}
    end
  end

  def update
    house = House.find(params[:id])
    if house.update(house_params)
      render json: { success: true, houses: House.all.order(:created_at) }
    else
      render json: {success: false, error: house.errors.full_messages}
    end
  end

  def destroy
    house = House.find(params[:id])
    house.destroy
    render json: { success: true, houses: House.all.order(:created_at) }
  end

  private

  def house_params
    params.require(:house).permit(:name, :sewerage)
  end
end