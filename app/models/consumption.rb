class Consumption < ApplicationRecord
  belongs_to :flat

  enum status: [:not_paid, :paid]

  validates_presence_of :water, :date
  validates :water, numericality: { greater_than_or_equal_to: 0 }
  validate :date_after_previous, if: :date_changed?

  before_save :set_prices, if: :water_changed?
  before_validation :check_previous, if: -> { water_changed? || date_changed? }

  scope :for_year, ->(year) { where(date: DateTime.new(year.try(:to_i) || Time.new.year).beginning_of_year..DateTime.new(year.try(:to_i) || Time.new.year).end_of_year) }

  def set_prices
    except_current = flat.consumptions.where.not(id: id)
    if except_current.any?
      self.water_price = (water - except_current.last.water) * Price.first.water_price
      self.sewerage_price = (water - except_current.last.water) * Price.first.sewerage_price if flat.sewerage
    else
      self.water_price = water * Price.first.water_price
      self.sewerage_price = water * Price.first.sewerage_price if flat.sewerage
    end
  end

  def check_previous
    consumptions = flat.consumptions.where.not(id: id)
    if consumptions.any?
      errors.add(:base, 'Показники мають бути вищими за попередні') if consumptions.last.water > water
    end
  end

  def date_after_previous
    consumptions = flat.consumptions.where.not(id: id)
    if consumptions.any? && consumptions.last.date >= date
      errors.add(:base, 'Показники мають бути за наступний місяць')
    end
  end
end