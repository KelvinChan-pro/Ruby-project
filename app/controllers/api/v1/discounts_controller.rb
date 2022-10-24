class Api::V1::DiscountsController < ApplicationController

    def create
        discount = Discount.new(discount_params)
        authorize discount
        discount.save!
        render json: {
            discount: discount.to_res,
        }
    end

    def destroy
        discount = Discount.find(params[:id])
        authorize discount
        discount.destroy!
        render json: {
            success: true
        }
    end

    def show
        discount = Discount.find_by(code: params[:code])
        render json: {
            discount: discount ? discount.to_res : { missing: true },
        }
    end

    private

    def discount_params
        params.require(:discount).permit(:code, :percentage, :amount).tap do |rams|
            rams[:user] = current_user
            if rams[:percentage].present?
                rams[:percentage] = rams[:percentage].to_f / 100
            else
                rams[:dollar_amount] = true
            end
        end
    end
end
