class CreateTokens < ActiveRecord::Migration[6.0]
  def change
    create_table :tokens, id: :uuid do |t|
      t.string :key
      t.text :metadata
      t.datetime :expires_at

      t.timestamps
    end
  end
end
