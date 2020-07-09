FactoryBot.define do
  factory :user do
    sequence :email do |n|
      "dummyEmail#{n}@gmail.com"
    end
    password { "secretPassword" }
    password_confirmation { "secretPassword" }
  end

  factory :entry do
    date { "2020-08-01"}
    description { "Test entry" }
    amount { 1234 }
    frequency { "one_time" }
  end
end
