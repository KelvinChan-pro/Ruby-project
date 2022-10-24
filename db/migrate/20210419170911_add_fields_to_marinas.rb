class AddFieldsToMarinas < ActiveRecord::Migration[6.0]
  def change
    add_column :marinas, :address_two, :string
    add_column :marinas, :zip, :string
  end
end
