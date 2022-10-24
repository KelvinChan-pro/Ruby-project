class OnboardReminder < ApplicationJob
	queue_as :default

	COPY = {
		specifications: 'add your boat information.',
		location: 'add your home lake. If you do not see your lake preloaded, click “add a lake” to enter a new location.',
		about_you: 'add in some information about you.',
		experience_overview: 'tell us about your boat and your experience on the water.',
		activities: 'add the activities that you will be hosting.',
		boat_features: 'add the features of your boat.',
		boat_rules: 'add the rules that you would like to include for your guests to follow on your boat.',
		guests_should_bring: 'add what guests should bring on your boat for trips.',
		pricing: 'add the price per hour that you would like to charge for hosting an experience.',
		availability: 'click on the calendar to set your availability. Remember, your availability is dictated by you! It can be as little as one day of availability per month or even every day of the week.',
		photos: 'add your photos. For best practices, these photos can include pictures of your boat and photos of activities that you will host.',
		identity_information: 'add some personal information for tax purposes.',
		bank_information: 'add your bank information so we can pay you at the end of yoru trips.',
		stripe_terms_of_service: 'and verify your account with stripe so we can pay you at the end of your trips.',
		insurance: "and provide your boat's insurance if you'd like. Insurance is not required to complete your boat profile but is recommended.",
		review: "and review and agree to Lake Hop's rules and terms of service.",
		gift: 'and tell us where we should send your free shirt!',
	}.freeze

	def perform(id, step)
		# if an onboard reminder already exists for this user delete it
		Sidekiq::Queue.new("default").each do |job|
			if job.klass === 'OnboardReminder' && job.args[0] === id
				job.delete
			end
		end

		user = User.find(id)
		OnboardMailer.send(
			email: user.email,
			name: user.first_name,
			copy: COPY[step.to_sym],
		)
	end
end
