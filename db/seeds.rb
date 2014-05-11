# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


j = User.create(name: 'Jesse Sessler', email: 'jesse@sessler.com', password: 'abc12345', password_confirmation: 'abc12345')
s = User.create(name: 'Spencer Stebbins', email: 'spencer@stebbins.com', password: 'abc12345', password_confirmation: 'abc12345')
w1 = Word.create(created_at: Date.today, part_of_speech: 'test', letters: 'hello')
w2 = Word.create(created_at: Date.today, part_of_speech: 'test', letters: 'how')
w3 = Word.create(created_at: Date.today, part_of_speech: 'test', letters: 'are')
w4 = Word.create(created_at: Date.today, part_of_speech: 'test', letters: 'you')

j.words << w1 << w2
s.words << w3 << w4
