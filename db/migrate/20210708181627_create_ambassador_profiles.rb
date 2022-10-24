class CreateAmbassadorProfiles < ActiveRecord::Migration[6.0]
  def change
    create_table :ambassador_profiles, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.string :uid
      t.timestamps
    end
  end
end
