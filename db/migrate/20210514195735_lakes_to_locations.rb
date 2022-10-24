class LakesToLocations < ActiveRecord::Migration[6.0]
	def change
	    rename_table :lakes, :regions
	    add_column :regions, :type, :string
	end 
end
