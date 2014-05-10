class CreateJoinTableEntryWord < ActiveRecord::Migration
  def change
    create_join_table :entries, :words do |t|
      # t.index [:entry_id, :word_id]
      # t.index [:word_id, :entry_id]
    end
  end
end
