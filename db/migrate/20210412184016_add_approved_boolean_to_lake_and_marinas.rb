class AddApprovedBooleanToLakeAndMarinas < ActiveRecord::Migration[6.0]
  def change
    add_column :lakes, :approved, :boolean, default: false
    add_column :marinas, :approved, :boolean, default: false

  end
end
