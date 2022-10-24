class Api::V1::UsersController < ApplicationController
	before_action :set_user, except: [:show, :confirm_email, :send_confirmation_email, :email]
	skip_before_action :authenticate_request, only: [:show, :confirm_email, :refresh]

	def show
		soft_authentication
		if params[:id]
			set_user
			render json: {
				profile: @user.to_profile_res,
			}
		else
			render json: {
				user: current_user&.to_res
			}
		end
	end

	def account
		authorize @user
		render json: {
			account: @user.to_res
		}
	end

	def update
		authorize @user
		@user.update!(user_params)
		if params[:changing_email]
			@user.email_confirmed = false
			@user.save
			@user.send_confirmation_email
		end
		if params[:changing_account]
			@user.update_stripe_account
		end
		render json: {
			user: @user.to_res,
		}
	end

	def profile_picture
		authorize @user
		@user.profile_picture.attach(data: params[:image])
		render json: {
			user: @user.to_res,
		}
	end

	def destroy
		authorize @user
		@user.destroy!
		render json: {
			success: true
		}
	end

	def send_confirmation_email
		current_user.send_confirmation_email
		render json: {
			success: true
		}
	end

	def confirm_email
		token = Token.get(params[:token])
		@user = User.find(token[:user_id])
		if @user
			@user.email_confirmed = true
			@user.save!
			Token.destroy(params[:token])
			render json: {
				auth_token: new_jwt,
				user: @user.to_res
			}
		else
			render json: {
				error: true
			}
		end
	end

	def external_account
		authorize @user
		@user.attach_external_account!(params[:token])
		render json: {
			user: @user.to_res,
		}
	end

	def refresh
		user = User.find(params[:id])
		redirect_to user.stripe_link
	end

	def dates
		authorize @user
        @user.update!(user_params)
        if params[:user][:pro_hopper]
        	@user.update_pro_hopper_dates(params[:user][:dates])
		else
			@user.update_dates(params[:user][:dates])
		end
		render json: {
			user: @user.to_res,
		}
	end

	def ambassador
		authorize @user
		ap = AmbassadorProfile.create!(user: @user)
		render json: { ambassador_profile: ap }
	end

	def destroy_ambassador
		authorize @user
		ap = AmbassadorProfile.find_by(user: @user)
		ap.destroy!
		render json: { success: true }
	end

	def background_check
		@user.background_check(params[:image])
		render json: { success: true }
	end

	def email
		Email.create!(email: params[:email])
		render json: { success: true }
	end

	private

	def user_params
		params.require(:user).permit(:email, :password, :first_name, :last_name, :phone_number, :story, :headline, :license_number, :full_name, :host, :address, :address_two, :city, :state, :zip, :ssn, :date_of_birth, :hear_about_us, :sms_enabled, :available_weekdays, :weekday_start, :weekday_end, :available_weekends, :weekend_start, :weekend_end, :dates, :pro_hopper_onboard).tap do |rams|
			if rams[:full_name]
				split = rams[:full_name].split(' ')
				rams[:first_name] = split[0]
				rams[:last_name] = split[1]
				rams.delete(:full_name)
			end
		end
	end

	def set_user
		@user = User.find(params[:id])
	end
end
