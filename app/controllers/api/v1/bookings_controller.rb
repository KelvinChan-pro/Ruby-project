class Api::V1::BookingsController < ApplicationController
	before_action :set_booking, only: [ :update, :show, :custom_refund, :message, :tip ]
	def create
		verify_email_confirmed?
		bp = booking_params
		bp[:user] = current_user
		booking = Booking.create!(bp)
		render json: {
			booking: booking.to_show_res
		}
	end

	def index
		if params[:profile_id]
			user = User.find(params[:profile_id])
		else
			user = current_user
		end

		if params[:hosting].to_i == 1

			render json: {
				bookings: user.host_bookings_index,
			}

		else

			render json: {
				bookings: user.bookings_index,
			}

		end
	end

	def update
		if params[:hosting].to_i == 1
			authorize @booking, :host_update?
		else
			authorize @booking, :guest_update?
		end
		
		@booking.update!(booking_params)

		@booking.check_for_discount

		new_status = params[:booking][:status]
		if new_status
			@booking.update_status!(new_status)
		end

		render json: {
			booking: @booking.to_show_res,
		}
	end

	def show
		if params[:hosting].to_i == 1
			authorize @booking, :host_show?
		else
			authorize @booking, :guest_show?
		end

		render json: {
			booking: @booking.to_show_res,
		}
	end

	def custom_refund
		authorize @booking
		@booking.refund(amount: params[:amount].to_f)
		@booking.update_status!('cancelled_by_guest')
		render json: {
			booking: @booking.to_show_res,
		}
	end

	def message
		hosting = params[:hosting].to_i == 1
		if hosting
			authorize @booking, :host_update?
		else
			authorize @booking, :guest_update?
		end
		@booking.message(hosting, params[:message], params[:reply])
		render json: {
			success: true,
		}
	end

	def reply
		hosting = params[:hosting].to_i == 1
		if hosting
			authorize @booking, :host_update?
		else
			authorize @booking, :guest_update?
		end
		@booking.reply(hosting, params[:message])
		render json: {
			success: true,
		}
	end

	def tip
		authorize @booking, :guest_update?
		@booking.send_tip(params[:amount].to_i)
		render json: {
			success: true,
		}
	end

	private

	def verify_email_confirmed?
		unless current_user.email_confirmed
			current_user.send_confirmation_email
			raise "Please verify your email address before booking a trip. We have sent a new email to your address: #{current_user.email}."
		end
	end

	def booking_params
		params.require(:booking).permit(:boat_id, :marina_id, :date, :duration_in_hours, :start_time, :number_of_guests, :goal_for_trip, :decline_message, :cancel_message, :discount_code, :filet_package, :media_package, guest_location_attributes: [ :lake_name, :address, :city, :state, :zip ], guest_boat_attributes: [ :boat_type, :make, :model, :year, :length ])
	end

	def set_booking
		@booking = Booking.find(params[:id])
	end
end
