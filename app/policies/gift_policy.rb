class GiftPolicy < ApplicationPolicy
	def update?
		  # admin or owner
    	user.admin? || record.user_id == user.id
  	end
end