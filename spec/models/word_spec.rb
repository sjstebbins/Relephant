require "spec_helper"

describe Word do

  # it { should validate_presence_of(:created_at) }
  xit { should have_and_belong_to_many(:users) }

end
