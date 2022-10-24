class Api::V1::AdminController < ApplicationController
    before_action :authorize_admin

    def users
        render json: {
            users: User.index(params[:offset] || 0, 100, params[:term]),
            user_count: User.count,
            replace: !!params[:term],
        }
    end

    def boats
        render json: {
            boat_count: Boat.count,
            boats: Boat.index(params[:offset] || 0, 100, params[:term]),
            replace: !!params[:term],
        }
    end

    def lakes
        render json: {
            lakes: Lake.index,
        }
    end

    def marinas
        render json: {
            marinas: Marina.index,
        }
    end

    def states
        render json: {
            states: State.index,
        }
    end

    def ambassadors
        render json: {
            ambassadors: AmbassadorProfile.index,
        }
    end

    def celebs
        render json: {
            celebs: Boat.celebrity_index,
        }
    end

    def pro_hoppers
        render json: {
            pro_hoppers: User.pro_hopper_index,
        }
    end

    def discounts
        render json: {
            discounts: Discount.index,
        }
    end

    def gifts
        render json: {
            gifts: Gift.index,
        }
    end

    def geocode
        res = GmapsClient.geocode(params[:query])
        render json: {
            res: res && res[0] && res[0][:geometry] || {},
        }
    end

    private

    def authorize_admin
        raise Pundit::NotAuthorizedError if !current_user.admin
    end
end
