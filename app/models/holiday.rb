class Holiday < ApplicationRecord
  validates_presence_of :date
  scope :for_dates, -> (start_date, end_date) {where('date <= ? AND date >= ?', end_date || DateTime.now.end_of_month, start_date || DateTime.now.beginning_of_month)}
end