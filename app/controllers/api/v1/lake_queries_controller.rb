class Api::V1::LakeQueriesController < ApplicationController
	skip_before_action :authenticate_request, only: [:create]
	
	def create
		lake_query = LakeQuery.create!(lake_query_params)
		render json: {
			lake_query: lake_query,
		}
	end

	def index
		render json: {
			gifts: LakeQuery.index,
		}
	end

	private

	def lake_query_params
		params.require(:lake_query).permit(:lake, :email)
	end
end
