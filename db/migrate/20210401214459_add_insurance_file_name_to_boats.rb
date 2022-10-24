class AddInsuranceFileNameToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :insurance_file_name, :string
  end
end
