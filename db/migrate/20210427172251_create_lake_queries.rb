class CreateLakeQueries < ActiveRecord::Migration[6.0]
  def change
    create_table :lake_queries, id: :uuid do |t|
      t.string :lake
      t.string :email

      t.timestamps
    end
  end
end
