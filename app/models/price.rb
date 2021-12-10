class Price < ApplicationRecord
  validates_presence_of :water_price, :sewerage_price
end