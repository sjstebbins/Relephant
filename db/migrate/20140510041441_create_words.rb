class CreateWords < ActiveRecord::Migration
  def change
    create_table :words do |t|
      t.datetime :created_at
      t.string :part_of_speech
      t.string :letters
    end
  end
end
