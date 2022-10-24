require 'csv'

namespace :marinas do
	desc 'create marinas and lakes'
	task create: :environment do

		def create_lake!(row)
			Lake.create(
				old_id: row[0],
				lat: row[1],
				lng: row[2],
				zoom: row[3],
				name: row[4],
			)
		end

		def create_marina!(row)
			lake = Lake.find_by(old_id: row[7])

			Marina.create!(
				name: row[1],
				address: row[2],
				city: row[3],
				state: row[4],
				lat: row[5],
				lng: row[6],
				lake: lake,
			)
		end

		Lake.destroy_all
		file = CSV.read(File.join(File.dirname(__FILE__), '..', 'assets', 'lakes.csv'))

		file.each do |row|
			create_lake!(row)
		end

		mfile = CSV.read(File.join(File.dirname(__FILE__), '..', 'assets', 'marinas.csv'))

		mfile.each do |row|
			create_marina!(row)
		end
	end
end