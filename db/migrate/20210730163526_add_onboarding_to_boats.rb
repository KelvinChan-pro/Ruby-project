class AddOnboardingToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :onboarding, :boolean, default: true
  end
end
