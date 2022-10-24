class ChangeResourcesToSubActivitiesOnBoats < ActiveRecord::Migration[6.0]
  def change
    rename_column :boats, :resources, :sub_activities
    rename_column :boats, :cruising, :leisure
  end
end
