class AddFieldsToGifts < ActiveRecord::Migration[6.0]
  def change
    add_column :gifts, :address_two, :string
    add_column :gifts, :zip, :string
  end
end
