class Reservation < ApplicationRecord
  belongs_to :user

  enum status: [:pending, :approved, :declined]

  validates_presence_of :start_date, :end_date
  validate :check_availability
  validate :check_dates

  scope :current_month, -> {where('start_date < ? AND end_date > ?', DateTime.now.end_of_month, DateTime.now.beginning_of_month)}

  private

  def check_availability
    existed = Reservation.where('start_date < ? AND end_date > ?', end_date, start_date).where.not(id: id)
    if existed.any? && (start_date_changed? || end_date_changed?)
      errors.add(:base, 'Нажаль ця машина на цей час недоступна')
    end
  end

  def check_dates
    errors.add(:base, 'Дата повернення не може бути раніше дати подачі') if start_date > end_date
  end
end