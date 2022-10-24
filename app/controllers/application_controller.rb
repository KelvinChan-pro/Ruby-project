class ApplicationController < ActionController::Base
  attr_reader :current_user
  before_action :authenticate_request
  rescue_from StandardError, with: :error_msg
  rescue_from Pundit::NotAuthorizedError, with: :not_authorized_msg
  skip_before_action :verify_authenticity_token
  
  include Pundit

  protected

  def authenticate_request
  	unless valid_token?
      	forbidden
      	return
  	end
  	@current_user = User.find(auth_token[:user_id])
  rescue JWT::VerificationError, JWT::DecodeError
  	forbidden
  end

  def soft_authentication
    unless valid_token?
        return
    end
    @current_user = User.find(auth_token[:user_id])
  rescue JWT::VerificationError, JWT::DecodeError
    return
  end

	private

	def forbidden(e='Please log in.')
		render json: { error: e }, status: 401
    return
	end

	def error_msg(e)
		logger.error e.message
    e.backtrace.each { |line| logger.error line }
    Rollbar.error(e) # log to rollbar
		msg = e.message.gsub("Validation failed: ", "")
		render json: { error: msg }
    return
	end

  def not_authorized_msg(e)
    render json: { error: "Not authorized for that action" }
    return
  end

	def http_token
	    @http_token ||= if request.headers['Authorization'].present?
	      request.headers['Authorization'].split(' ').last
	    end
	end

	def auth_token
  	@auth_token ||= JsonWebToken.decode(http_token)
	end

  def valid_token?
  	http_token && auth_token && auth_token[:user_id].to_i && auth_token[:expires] && Time.now < Time.parse(auth_token[:expires])
  end

  def new_jwt(user: @user)
    jwt = JsonWebToken.encode({
      user_id: user.id,
      expires: Time.now + 15.minutes,
    })
    refresh_token = JsonWebToken.encode({
      user_id: user.id,
      expires: Time.now + 2.weeks,
    })
    cookies[:refresh_token] = {
      value: refresh_token,
      expires: Time.now + 2.weeks,
      httponly: true,
    }
    jwt
  end

end
