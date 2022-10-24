class Api::V1::BookmarksController < ApplicationController
	def create
		bookmark = Bookmark.create!(bookmark_params)
		render json: {
			bookmarked: true,
		}
	end

	def destroy
		bookmark = Bookmark.find_by(boat_id: params[:id])
		bookmark.destroy!
		render json: {
			bookmarked: false,
		}
	end

	def index
		render json: {
			boats: current_user.bookmark_index
		}
	end

	private

	def bookmark_params
		params.require(:bookmark).permit(:boat_id).tap do |rams|
			rams[:user] = current_user
		end
	end
end
