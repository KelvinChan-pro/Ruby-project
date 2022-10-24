def encode_image_url(url)
	if url && !url.empty?
		image = open(url)
		"data:#{image.meta['content-type']};base64," + Base64.encode64(image.read)
	end
rescue Exception => error
	return
end

lake = Lake.find_by(name: 'Lake Powell')
marina = Marina.find_by(name: 'Antelope Point Marina')

15.times do
	first_name, last_name = Faker::Movies::StarWars.character.split(' ')
	email = Faker::Internet.email
	user = User.create!(
		first_name: first_name,
		last_name: last_name || '_',
		email: email,
		onboard_completed: true,
		email_confirmed: true,
		password: 'doesntmatter',
		story: Faker::Books::Lovecraft.paragraph(sentence_count: 2),
		headline: Faker::TvShows::RickAndMorty.quote,
		host: true,
	)

	# profile_picture = encode_image_url(Faker::Avatar.image(slug: "my-own-slug", size: "100x100"))
	# user.profile_picture.attach(data: profile_picture)

	boat = Boat.create!(
		user: user,
		public: true,
		year: 2020,
		boat_type: 'pontoon',
		make: Faker::Movies::StarWars.specie,
		model: Faker::Movies::StarWars.vehicle,
		lake: lake,
		marina: marina,
		guest_count: rand(4..15),
		title: Faker::Books::Lovecraft.tome,
		description: Faker::Books::Lovecraft.fhtagn(number: 2),
		fishing: [true, false].sample,
		leisure: [true, false].sample,
		watersports: [true, false].sample,
		price: rand(100..300),
		time_increments: {
			"2": true,
			"6": true,
		},
		cancellation_policy: 'strict',
		rental: [true, false].sample,
		available_weekends: [true, false].sample,
		available_weekdays: [true, false].sample,
		weekday_start: rand(5..10),
		weekday_end: rand(16..21),
		weekend_start: rand(5..10),
		weekend_end: rand(16..21),
	)

	# image = encode_image_url('https://loremflickr.com/g/320/240/starwars')
	# boat.cover_photo.attach(data: image)
	# image = encode_image_url('https://loremflickr.com/g/320/240/starwars')
	# boat.preview_photo_1.attach(data: image)
	# image = encode_image_url('https://loremflickr.com/g/320/240/starwars')
	# boat.preview_photo_2.attach(data: image)



end


