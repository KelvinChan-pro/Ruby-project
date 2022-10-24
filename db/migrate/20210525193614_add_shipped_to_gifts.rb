class AddShippedToGifts < ActiveRecord::Migration[6.0]
  def change
    add_column :gifts, :shipped, :boolean, default: false
  end
end
