class UserPolicy < ApplicationPolicy
	def update?
		# admin or self
    	user.admin? || record.id == user.id
  	end

  	def profile_picture?
  		# admin or self
  		user.admin? || record.id == user.id
  	end

  	def destroy?
  		# admin or self
  		user.admin? || record.id == user.id
  	end

    def external_account?
      # admin or self
      user.admin? || record.id == user.id
    end

    def ambassador?
      user.admin?
    end

    def index?
      # admin or self
      user.admin? || record.id == user.id
    end

    def dates?
      # admin or self
      user.admin? || record.id == user.id
    end

    def destroy_ambassador?
      user.admin?
    end

    def account?
      user.admin?
    end
end