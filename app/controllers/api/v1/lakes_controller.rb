class Api::V1::LakesController < ApplicationController
    before_action :set_lake, except: [ :search, :create ]
    skip_before_action :authenticate_request, only: [ :search ]

    def show
        authorize @lake
        render json: {
            lake: @lake.to_index_res,
        }
    end

    def update
        authorize @lake
        @lake.update!(lake_params)
        render json: {
            lake: @lake.to_index_res,
        }
    end

    def create
        authorize Lake.new
        lp = lake_params
        lp[:type] = 'Lake'
        lake = Lake.create!(lp)
        render json: {
            lake: lake.to_index_res,
        }
    end

    def destroy
        authorize @lake
        @lake.destroy!
        render json: {
            lakes: Lake.index,
        }
    end

    def search
        render json: {
            lakes: Region.search(params[:term].to_s)
        }
    end

    private

    def lake_params
        params.require(:lake).permit(:lat, :lng, :zoom, :name, :approved)
    end

    def set_lake
        @lake = Region.find(params[:id])
    end

end
