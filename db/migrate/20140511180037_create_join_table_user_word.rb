class CreateJoinTableUserWord < ActiveRecord::Migration
  def change
    create_join_table :users, :words do |t|
      # t.index [:user_id, :word_id]
      # t.index [:word_id, :user_id]
    end
  end
end
