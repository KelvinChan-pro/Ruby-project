class Api::V1::MarinasController < ApplicationController
    before_action :set_marina, except: [:index, :create]

    def index
        render json: {
            marinas: Marina.option_index,
            lakes: Lake.option_index,
        }
    end

    def create
        marina = Marina.create!(marina_params)
        render json: {
            marina: marina.to_index_res,
        }
    end

    def show
        authorize @marina
        render json: {
            marina: @marina.to_index_res,
        }
    end

    def update
        authorize @marina
        @marina.update!(marina_params)
        render json: {
            marina: @marina.to_index_res,
        }
    end

    def destroy
        authorize @marina
        @marina.destroy!
        render json: {
            marinas: Marina.index,
        }
    end

    private

    def marina_params
        params.require(:marina).permit(:lake_name, :lake_id, :name, :address, :address, :address_two, :city, :zip, :state, :lat, :lng, :approved).tap do |rams|
            rams[:user] = current_user
            if rams[:lake_name].present?
                rams[:lake] = Lake.find_or_create_by(name: rams[:lake_name])
                rams.delete(:lake_name)
            end
            rams.delete(:lake_name)
        end
    end

    def set_marina
        @marina = Marina.find(params[:id])
    end
end
