class Api::V1::OnboardController < ApplicationController
	def update
		current_user.host = params[:host] if params.key?(:host)
		current_user.onboard_step = params[:step].to_i if params.key?(:step)
		current_user.onboard_sub_step = params[:sub_step].to_i if params.key?(:sub_step)
		current_user.onboard_metadata[params[:key]] = true if params.key?(:key)
		current_user.onboard_completed = params[:completed] if params.key?(:completed)
		current_user.boat_only_onboard = params[:boat_only_onboard] if params.key?(:boat_only_onboard)
		current_user.pro_hopper_onboard = params[:pro_hopper_onboard] if params.key?(:pro_hopper_onboard)
		current_user.save!

		if current_user.onboard_completed && params[:boat_id]
			boat = Boat.find(params[:boat_id])
			boat.public = true
			boat.onboarding = false
			boat.save!
			current_user.destroy_onboard_reminders
		elsif params[:next]
			current_user.set_onboard_reminder(params[:next])
		end

		render json: {
			onboard_metadata: current_user.onboard_metadata,
		}
	end

	def show
		boat = current_user.boats.find_by(onboarding: true)
		if boat
			render json: {
				boat: boat.to_show_res(current_user),
			}
		else
			render json: {
				boat: {}
			}
		end
	end
end
