class BoatPolicy < ApplicationPolicy
	def update?
		  # admin or owner
    	user.admin? || record.user_id == user.id
  	end

  	def destroy?
  		# admin or owner
      user.admin? || record.user_id == user.id
  	end

  	def upload_insurance?
  		# admin or owner
      user.admin? || record.user_id == user.id
  	end

    def images?
      # admin or owner
      user.admin? || record.user_id == user.id
    end

    def locations?
      # admin or owner
      user.admin? || record.user_id == user.id
    end

    def dates?
      # admin or owner
      user.admin? || record.user_id == user.id
    end

    def custom_cancellation_policy?
      user.admin?
    end

    def show?
      if user&.admin?
        true
      elsif user && user.id == record.user_id
        !record.force_private
      else
        record.public
      end
    end
end