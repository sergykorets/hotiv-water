class Notice < ApplicationRecord
  validates_presence_of :date, :body

  scope :for_date, -> (date) {where('date <= ? AND date >= ?', date.to_date.end_of_day || DateTime.now.end_of_day, date.to_date.beginning_of_day || DateTime.now.beginning_of_day).order(:created_at) if date.present?}
end