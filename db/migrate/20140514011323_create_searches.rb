class CreateSearches < ActiveRecord::Migration
  def change
    create_table :searches do |t|
      t.text :content
    end
  end
end
