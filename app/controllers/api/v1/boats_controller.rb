class Api::V1::BoatsController < ApplicationController
	before_action :set_boat, except: [:create, :index, :search]
    skip_before_action :authenticate_request, only: [ :search, :show, :times ]
    before_action :soft_authentication, only: [ :show, :search ]
	def show
		authorize @boat
		render json: {
			boat: @boat.to_show_res(current_user),
		}
	end

	def index
		if params[:user_id]
			user = User.find(params[:user_id])
			authorize user
			render json: {
				boats: user.boat_index
			}
		else
			render json: {
				boats: current_user.boat_index,
			}
		end
	end
	
	def create
		boat = Boat.create(user_id: current_user.id)
		boat.update!(boat_params)
		render json: {
			boat: boat.to_show_res
		}
	end

	def update
		authorize @boat
		@boat.update!(boat_params)
		render json: {
			boat: @boat.to_show_res,
		}
	end

	def destroy
		authorize @boat
		@boat.destroy!
		render json: {
			success: true
		}
	end

	def upload_insurance
		authorize @boat
		@boat.insurance.attach(data: params[:file])
		@boat.insurance_file_name = params[:name]
		@boat.send_insurance_email!
		@boat.save!
		render json: {
			boat: @boat.to_show_res,
		}
	end

	def images
		authorize @boat
		@boat.send(params[:image_type]).attach(data: params[:image])
		render json: {
			boat: @boat.to_show_res,
		}
	end

	def locations
		authorize @boat
		@boat.update_locations!(params[:marinas])
		render json: {
			boat: @boat.to_show_res,
		}
	end

	def times
		render json: {
			times: @boat.time_ranges_on_date(params[:date])
		}
	end

	def search
		sp = search_params
		if (sp[:lake_id])
			lake = Region.find(sp[:lake_id])
		else
			lake = Country.first
		end
		boats = Boat.search(sp, current_user, params[:offset])
		render json: {
			boats: boats,
			lake: lake.to_index_res,
			marinas: lake.marina_index(boats.pluck(:id)),
			push: params[:offset] != 0 && !!params[:offset],
		}
	end

	def custom_cancellation_policy
		authorize @boat
		@boat.custom_cancellation_policy = params[:custom_cancellation_policy]
		@boat.save!
		render json: { success: true }
	end

	def question
		guest = User.find(params[:user_id])
		@boat.send_question(guest: guest, question: params[:question])
		render json: { success: true }
	end


	private

	def boat_params
		params.require(:boat).permit(
			:boat_type, :make, :model, :year, :length, :guest_count, :marina_id, 
			:city, :state, :rental, :title, :description, :fishing, :leisure, :watersports, 
			:price, :first_guests_discount, :guests_should_bring, :cancellation_policy, 
			:filet_package, :filet_package_price, :media_package, :media_package_price,
			:available_weekends, :available_weekdays, :weekday_start, :weekday_end, :weekend_start, 
			:weekend_end, :security_deposit_amount, :public, :bass, :crappie, :walleye, :trout, 
			:catfish, :striper, :bow, :tubing, :swimming, :floating, :cruising, :sunset_cruise, 
			:special_moments, :bachelor, :wake_surfing, :wakeboarding, :foiling, :skiing, :celebrity, :celebrity_requested,
			:pro_hopper, :pro_hopper_approved, :celebrity_fishing, :celebrity_watersports
		).tap do |rams|
			rams[:features] = params[:boat][:features].to_unsafe_h if params[:boat][:features]
			rams[:rules] = params[:boat][:rules].to_unsafe_h if params[:boat][:rules]
            rams[:extra_features] = params[:boat][:extra_features].split(',') if params[:boat][:extra_features]
            rams[:extra_navigation] = params[:boat][:extra_navigation].split(',') if params[:boat][:extra_navigation]
            rams[:extra_rules] = params[:boat][:extra_rules].to_unsafe_h if params[:boat][:extra_rules]
			rams[:time_increments] = params[:boat][:time_increments].to_unsafe_h if params[:boat][:time_increments]
			rams[:force_private] = !rams[:public] if rams.key?(:public) && current_user.admin?
		end
	end

	def search_params
		params.permit(
			:lake_id, :date, :min_price, :max_price,
			:fishing, :leisure, :watersports,
			:bass, :crappie, :walleye, :trout, 
			:catfish, :striper, :bow, :tubing, 
			:swimming, :floating, :cruising, :sunset_cruise, :bachelor, 
			:special_moments, :wake_surfing, :wakeboarding, 
			:foiling, :skiing, :boat_type, :guest_count,
			:min_lat, :max_lat, :min_lng, :max_lng, :celebrity,
			:'sort_by.price', :'sort_by.rating', :'sort_by.guest_count',
			:'sort_by.trip_count', :celebrity_fishing, :celebrity_watersports
		).to_h.symbolize_keys
	end

	def set_boat
		@boat = Boat.find(params[:id])
	end
end
