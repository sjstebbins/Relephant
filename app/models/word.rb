class Word < ActiveRecord::Base
  has_and_belongs_to_many(:users)
  # validates(:created_at, presence: true)
end
