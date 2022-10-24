Rails.application.routes.draw do
	require "sidekiq/web"
	root 'root#index'
	
	scope :admin do
		# Sidekiq Basic Auth from routes on production environment
	    Sidekiq::Web.use Rack::Auth::Basic do |username, password|
	    	ActiveSupport::SecurityUtils.secure_compare(::Digest::SHA256.hexdigest(username), ::Digest::SHA256.hexdigest(ENV["SIDEKIQ_AUTH_USERNAME"])) &
	        ActiveSupport::SecurityUtils.secure_compare(::Digest::SHA256.hexdigest(password), ::Digest::SHA256.hexdigest(ENV["SIDEKIQ_AUTH_PASSWORD"]))
	    end if Rails.env.production?

	    mount Sidekiq::Web, at: '/sidekiq'
	  end

	namespace 'api' do
		namespace 'v1' do

			# AUTH ROUTES
			post 'sign_up', to: 'auth#sign_up'
			post 'login', to: 'auth#login'
			post 'reset_password', to: 'auth#reset_password'
			post 'change_password', to: 'auth#change_password'
			get 'refresh_token', to: 'auth#refresh_token'
			get 'current_user', to: 'users#show'
			post 'sign_out', to: 'auth#sign_out'

			# RESOURCES
			resources :users, only: [:update, :destroy, :show] do

				member do
					post 'profile_picture', to: 'users#profile_picture'
					post 'external_account', to: 'users#external_account'
					get 'refresh', to: 'users#refresh'
					post 'ambassador', to: 'users#ambassador'
					post 'destroy_ambassador', to: 'users#destroy_ambassador'
					post 'background_check', to: 'users#background_check'
					post 'dates', to: 'users#dates'
					get 'account', to: 'users#account'
				end

				collection do
					post 'send_confirmation_email', to: 'users#send_confirmation_email'
					post 'confirm_email', to: 'users#confirm_email'
					post 'email', to: 'users#email'
				end

			end

			resources :boats, except: [:edit] do

				member do
					post 'upload_insurance', to: 'boats#upload_insurance'
					post 'images', to: 'boats#images'
					post 'locations', to: 'boats#locations'
					get 'times', to: 'boats#times'
					post 'custom_cancellation_policy', to: 'boats#custom_cancellation_policy'
					post 'question', to: 'boats#question'
				end

				collection do
					get 'search', to: 'search'
				end

			end

			resources :gifts, only: [:create, :update, :index]
			
			resources :marinas
			
			resources :lakes, only: [:show, :update, :create, :destroy] do

				collection do
					get 'search', to: 'search'
				end

			end

			resources :admin, only: [:index] do
				collection do
					get 'geocode', to: 'admin#geocode'
					get 'users', to: 'admin#users'
					get 'boats', to: 'admin#boats'
					get 'lakes', to: 'admin#lakes'
					get 'states', to: 'admin#states'
					get 'marinas', to: 'admin#marinas'
					get 'ambassadors', to: 'admin#ambassadors'
					get 'pro_hoppers', to: 'admin#pro_hoppers'
					get 'celebs', to: 'admin#celebs'
					get 'discounts', to: 'admin#discounts'
					get 'gifts', to: 'admin#gifts'
				end
			end

			resources :bookings, only: [:create, :show, :update, :index] do
				member do
					post 'custom_refund', to: 'bookings#custom_refund'
					post 'message', to: 'bookings#message'
					post 'tip', to: 'bookings#tip'
				end
			end

			resources :reviews, only: [:create]

			resources :lake_queries, only: [:create, :index]

			resources :bookmarks, only: [:create, :destroy, :index]

			resources :ambassadors, only: [:show]

			resources :discounts, only: [:create, :destroy] do
				collection do
					get ':code', to: 'discounts#show'
				end
			end

			resources :configs, only: [:index]

			post 'onboard', to: 'onboard#update'
			get 'onboard', to: 'onboard#show'
		end
	end

	get 'privacy_policy', to: 'root#privacy_policy'
	get 'terms_of_service', to: 'root#terms_of_service'

	get '*path', to: 'root#index'
end
