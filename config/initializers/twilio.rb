TwilioClient = Twilio::REST::Client.new(ENV['TWILIO_SID'], ENV['TWILIO_AUTH_TOKEN'])

class TwilioService
	NUMS = %w(0 1 2 3 4 5 6 7 8 9).freeze

	def self.send(to:, template:, params:, type:)
		to = to.split('').filter do |n|
			NUMS.include?(n)
		end
		to.prepend(1) if to.length < 11

		url = ENV["DOMAIN"] + "/bookings/#{params[:id]}?type=#{type}"
		message = templates(template: template, params: params, url: url, type: type)

		TwilioClient.messages.create(
			from: ENV['TWILIO_NUMBER'],
			to: '+' + to.join(''),
			body: message,
		)
	end

	def self.templates(template:, params:, url:, type: nil)
		case template
		when 'booking-request-guest'
			"Your booking has been received by the host. When the host confirms, the hold on your payment will be replaced by a charge."
		when 'booking-request-host'
			"Hey there, #{params[:host_first_name]}! You just received a new booking request. #{url}"
		when 'booking-approved'
			"Hey #{params[:guest_first_name]}, You’re going to #{params[:lake]}! Your host, #{params[:host_first_name]}, just approved your booking request. Review what’s next, things to bring, and more that you’ll need for your actual trip. #{url}"
		when 'booking-declined'
			"Hey #{params[:guest_first_name]}, unfortunately your booking request has been declined. This can happen for many reasons, including a change in your host’s availability, or unexpected poor weather. We apologize for any inconvenience this may cause."
		when 'booking-cancelled-by-host-host'
			"This is a confirmation of your booking cancellation on #{params[:date]}. Your guest has been fully refunded for the trip total."
		when 'booking-cancelled-by-host-guest'
			"Hey #{params[:guest_first_name]}, we regret to inform you that your host, #{params[:host_first_name]} cancelled your booking on #{params[:date]}. You will be fully refunded #{params[:amount_with_service_fee]} for the trip."
		when 'booking-cancelled-by-guest-host'
			"Hey #{params[:host_first_name]}, we regret to inform you that your guest #{params[:guest_first_name]} cancelled your booking on #{params[:date]}."
		when 'booking-cancelled-by-guest-guest'
			"This is a confirmation of your booking cancellation on #{params[:date]}."
		when 'booking-completed-host'
			"We hope you had a great time out on the water! A #{params[:host_amount]} transfer has been made to your bank account. The only thing left for you to do is leave a review. Reviews are important for future guests to know what you thought about your trip. #{url}"
		when 'booking-completed-guest'
			"We hope you had a great time out on the water! The only thing left for you to do is leave a review. Reviews are important for future guests to know what you thought about your trip."
		when "booking-message"
			"Hey #{params[:receiver_name]}, you just received a message from #{type === 'host' ? 'a future guest' : 'your host'}, #{params[:sender_name]}: #{params[:message]}. You can reply to this message here: #{params[:reply_url]}"
		when 'booking-reply'
			"Hey #{params[:receiver_name]}, your #{type} replied to your message: #{params[:message]}. You can reply back here: #{params[:reply_url]}"
		else
			raise "sms template (#{template}) does not exist"
		end
	end
end