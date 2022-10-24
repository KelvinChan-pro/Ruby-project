class CreatePasswordResets < ActiveRecord::Migration[6.0]
  def change
    create_table :password_resets, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.string :token
      t.datetime :expire_at

      t.timestamps
    end
  end
end