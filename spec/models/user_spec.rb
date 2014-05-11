require "spec_helper"

describe User do

  it { should validate_presence_of(:email) }
  it { should validate_presence_of(:name) }
  xit { should have_and_belong_to_many(:words) }

end
