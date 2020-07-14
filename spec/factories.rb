FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "dummyEmail#{n}@example.com" }
    password { "secretPassword" }
    password_confirmation { "secretPassword" }
    current_balance { 100000 }
  end

  factory :entry do
    date { "2020-08-01" }
    description { "Test entry" }
    amount { 1234 }
    frequency { "one-time" }
    association :user
  end
end
