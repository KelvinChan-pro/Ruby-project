class Api::V1::AmbassadorsController < ApplicationController
    def show
        ambassador = AmbassadorProfile.find_by(user_id: params[:id])
        render json: {
            ambassador: ambassador.to_show_res,
        }
    end
end
