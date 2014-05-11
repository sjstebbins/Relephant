class Entry < ActiveRecord::Base
  belongs_to(:user)
  has_and_belongs_to_many(:words)
  validates(:created_at, presence: true)
end
