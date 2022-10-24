class MarinaPolicy < ApplicationPolicy
	def update?
    	user.admin?
  	end

  	def show?
  		user.admin?
  	end

  	def destroy?
  		user.admin?
  	end
end