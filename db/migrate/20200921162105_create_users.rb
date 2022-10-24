class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users, id: :uuid do |t|
      t.string :email
      t.string :username
      t.string :password_digest
      t.boolean :email_confirmed, default: false
      t.string :type
      t.timestamps
    end
  end
end
