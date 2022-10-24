class RootController < ApplicationController
	skip_before_action :authenticate_request
	def index; end

	def privacy_policy; end

	def terms_of_service; end
end
