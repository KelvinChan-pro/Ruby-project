namespace :boats do
	desc 'create new sub activities'
	task create_sub_activities: :environment do

		Boat.all.each do |boat|

			if boat.sub_activities["fishing"]
				boat.bass = !!boat.sub_activities["fishing"]["bass"]
				boat.crappie = !!boat.sub_activities["fishing"]["crappie"]
				boat.walleye = !!boat.sub_activities["fishing"]["walleye"]
				boat.trout = !!boat.sub_activities["fishing"]["trout"]
				boat.catfish = !!boat.sub_activities["fishing"]["catfish"]
				boat.striper = !!boat.sub_activities["fishing"]["striper"]
				boat.bow = !!boat.sub_activities["fishing"]["bow"]
			end

			if boat.sub_activities["leisure"]
				boat.tubing = !!boat.sub_activities["leisure"]["tubing"]
				boat.swimming = !!boat.sub_activities["leisure"]["swimming"]
				boat.floating = !!boat.sub_activities["leisure"]["floating"]
				boat.cruising = !!boat.sub_activities["leisure"]["cruising"]
				boat.sunset_cruise = !!boat.sub_activities["leisure"]["sunset_cruise"]
				boat.special_moments = !!boat.sub_activities["leisure"]["special_moments"]
			end

			if boat.sub_activities["watersports"]
				boat.wake_surfing = !!boat.sub_activities["watersports"]["wake_surfing"]
				boat.wakeboarding = !!boat.sub_activities["watersports"]["wakeboarding"]
				boat.foiling = !!boat.sub_activities["watersports"]["foiling"]
				boat.skiing = !!boat.sub_activities["watersports"]["skiing"]
			end
			
			boat.save
		end
	end

	desc 'move boat date stuff to user model'
	task multiple: :environment do

		Boat.all.each do |boat|

			boat.user.weekend_start = boat.weekend_start
			boat.user.weekend_end = boat.weekend_end
			boat.user.weekday_start = boat.weekday_start
			boat.user.weekday_end = boat.weekday_end
			boat.user.available_weekends = boat.available_weekends
			boat.user.available_weekdays = boat.available_weekdays
			boat.user.save

			boat.boat_dates.each do |bd|
				bd.user = boat.user
				bd.save
			end

			if boat.user.onboard_completed
				boat.onboarding = false
				boat.save
			end
			
		end

	end
end