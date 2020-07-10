class Entry < ApplicationRecord
  validates :date, presence: true
  validates :description, presence: true, length: { minimum: 1, maximum: 64 }
  validates :frequency, presence: true
  validates :amount, presence: true
end
