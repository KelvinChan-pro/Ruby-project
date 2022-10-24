class AddTitleAndDescriptionToBoat < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :title, :string
    add_column :boats, :description, :text
  end
end
