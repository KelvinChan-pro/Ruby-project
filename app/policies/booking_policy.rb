class BookingPolicy < ApplicationPolicy
	def guest_update?
		is_guest?
	end

	def host_update?
		is_host?
	end

	def host_show?
		is_host?
	end

	def guest_show?
		is_guest?
	end

	def custom_refund?
		user.admin? 
	end

	def message_host?
		is_guest?
	end

	def tip?
		is_guest?
	end

	private

	def is_host?
		record.boat.user_id == user.id
	end

	def is_guest?
		record.user_id == user.id
	end
end