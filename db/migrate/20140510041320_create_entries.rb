class CreateEntries < ActiveRecord::Migration
  def change
    create_table :entries do |t|
      t.datetime :created_at
      t.references :user
    end
  end
end
