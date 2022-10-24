class AddUserToMarinas < ActiveRecord::Migration[6.0]
  def change
    add_reference :marinas, :user, null: true, foreign_key: true, type: :uuid
  end
end
