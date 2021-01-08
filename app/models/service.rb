class Service < ApplicationRecord
  has_and_belongs_to_many :reservations
  validates :price, numericality: { greater_than: 0 }
end