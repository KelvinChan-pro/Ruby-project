namespace :states do
	desc 'create new sub activities'
	task create: :environment do
		State.destroy_all
		State.create_all
		Marina.all.each do |marina|
			marina.state_region = State.find_by(name: State::STATES[marina.state&.to_sym])
			marina.save
		end
	end
end