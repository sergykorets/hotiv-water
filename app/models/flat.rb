class Flat < ApplicationRecord
  belongs_to :house
  has_many :consumptions, dependent: :destroy

  validates_presence_of :name, :owner

  before_create :set_sewerage

  def set_sewerage
    self.sewerage = house.sewerage
  end
end