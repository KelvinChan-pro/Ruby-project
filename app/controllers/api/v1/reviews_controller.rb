class Api::V1::ReviewsController < ApplicationController
	def create
		review = Review.create!(review_params)
		render json: {
			review: review.to_res
		}
	end

	private

	def review_params
		params.require(:review).permit(:rating, :message, :booking_id).tap do |rams|
			rams[:user] = current_user
			rams[:host] = params[:hosting].to_i == 1
		end
	end
end
