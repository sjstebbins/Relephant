require "spec_helper"

describe Entry do

  it { should validate_presence_of(:created_at) }
  it { should belong_to(:user) }
  # it { should have_and_belong_to_many(:words) }

end
