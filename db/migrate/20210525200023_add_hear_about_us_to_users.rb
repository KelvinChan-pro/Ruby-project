class AddHearAboutUsToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :hear_about_us, :string
  end
end
