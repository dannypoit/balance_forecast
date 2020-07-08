FactoryBot.define do
  factory :user do
    
  end

  factory :entry do
    date { "2020-08-01"}
    description { "Test entry" }
    amount { 1234 }
    frequency { "one_time" }
  end
end
