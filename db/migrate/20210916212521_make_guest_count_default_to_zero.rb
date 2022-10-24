class MakeGuestCountDefaultToZero < ActiveRecord::Migration[6.0]
  def change
  	change_column :boats, :guest_count, :integer, default: 0
  end
end
