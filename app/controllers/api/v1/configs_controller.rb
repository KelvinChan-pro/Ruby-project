require 'uri'
require 'net/http'

class Api::V1::ConfigsController < ApplicationController
    skip_before_action :authenticate_request
    
    def index

        uri = URI.parse('https://api.heroku.com/apps/lake-hop-prod/config-vars')

        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true if uri.scheme == 'https'

        http.start do
            request = Net::HTTP::Get.new(uri.request_uri)
            # request['authorization'] = "Bearer 11bf4621-cedc-4746-9353-3f5b84b8485a"
            request['authorization'] = "Bearer " + ENV["HEROKU_TOKEN"]
            request['accept'] = "application/vnd.heroku+json; version=3"
            response = http.request(request)
            render json: {
                Configs: {
                    Google_Map_Key: JSON.parse(response.body)["GOOGLE_MAPS_API_KEY"],
                    Stripe_Public_Key: JSON.parse(response.body)["STRIPE_PUBLIC_KEY"],
                    GetStream_Api_Key: JSON.parse(response.body)["GET_STREAM_API_KEY"],
                }
            }
        end
    end
end