class Bookmark < ApplicationRecord
  belongs_to :user
  belongs_to :boat
  validates_uniqueness_of :boat, scope: [:user]
end
