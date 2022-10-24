class CreateEmails < ActiveRecord::Migration[6.0]
  def change
    create_table :emails, id: :uuid do |t|
      t.string :email

      t.timestamps
    end
  end
end
