class CreateReviews < ActiveRecord::Migration[6.0]
  def change
    create_table :reviews, id: :uuid do |t|
      t.integer :rating
      t.text :message
      t.references :booking, null: false, foreign_key: true, type: :uuid
      t.boolean :host
      t.references :user, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
