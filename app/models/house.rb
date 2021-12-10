class House < ApplicationRecord
  has_many :flats, dependent: :destroy

  validates_presence_of :name
end