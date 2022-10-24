class AddAmbassadorProfileReferenceToUsers < ActiveRecord::Migration[6.0]
  def change
    add_reference :users, :ambassador_profile, null: true, foreign_key: true, type: :uuid
  end
end
