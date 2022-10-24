class Api::V1::GiftsController < ApplicationController
	def create
		gp = gift_params
		gp[:user] = current_user
		gift = Gift.create!(gp)
		render json: {
			gift: gift.to_res
		}
	end

	def update
		gift = Gift.find(params[:id])
		authorize gift
		gift.update!(gift_params)
		render json: {
			gift: gift.to_res,
		}
	end

	def index
		render json: {
			gifts: Gift.index,
		}
	end

	private

	def gift_params
		params.require(:gift).permit(:gift_type, :size, :address, :address_two, :city, :state, :zip, :shipped)
	end
end
