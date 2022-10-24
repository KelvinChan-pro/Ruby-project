class AddLakeReferenceToBoats < ActiveRecord::Migration[6.0]
  def change
    remove_column :boats, :lake, :string
    remove_column :boats, :marina, :string
    add_reference :boats, :lake, null: true, foreign_key: true, type: :uuid
    add_reference :boats, :marina, null: true, foreign_key: true, type: :uuid
  end
end
