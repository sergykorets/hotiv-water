class Reservation < ApplicationRecord
  belongs_to :user
  has_and_belongs_to_many :services

  enum status: [:paid, :not_paid, :partialy_paid, :free]

  validates_presence_of :start_date, :end_date
  validate :check_availability
  validate :check_dates

  scope :current_month, -> {where('start_date < ? AND end_date > ?', DateTime.now.end_of_month, DateTime.now.beginning_of_month).order('start_date DESC')}
  scope :for_dates, -> (start_date, end_date) {where('start_date <= ? AND end_date >= ?', end_date || DateTime.now.end_of_month, start_date || DateTime.now.beginning_of_month).order('start_date DESC')}

  private

  def check_availability
    existed = Reservation.where('start_date < ? AND end_date > ?', end_date, start_date).where.not(id: id)
    if existed.any? && (start_date_changed? || end_date_changed?)
      errors.add(:base, 'Запис на цей час недоступний')
    end
  end

  def check_dates
    errors.add(:base, 'Час закінчення прийому не може бути раніше часу початку') if start_date >= end_date
  end
end