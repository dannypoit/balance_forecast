class Entry < ApplicationRecord
  validates :date, presence: true
  validates :description, presence: true, length: { minimum: 1, maximum: 64 }
  validates :frequency, presence: true
  validates_inclusion_of :frequency, :in => %w(one-time weekly bi-weekly monthly bi-monthly quarterly annually), :message => 'Frequency selected is not a valid option'
  validates :amount, presence: true

  belongs_to :user
end
