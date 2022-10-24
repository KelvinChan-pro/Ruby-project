class AddStateIdToBoats < ActiveRecord::Migration[6.0]
  def change
  	# add_reference :marinas, :lake, null: true, foreign_key: { to_table: :regions }, type: :uuid
  	add_reference :marinas, :state, null: true, foreign_key: { to_table: :regions }, type: :uuid
  	add_reference :marinas, :country, null: true, foreign_key: { to_table: :regions }, type: :uuid
  end
end
