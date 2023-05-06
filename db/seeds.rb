# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

TimeZone.destroy_all

TimeZone.create!(name: 'est', description: 'Eastern Standard Time', relative_to_gmt: '-5')

p "Created #{TimeZone.count} time zones."
