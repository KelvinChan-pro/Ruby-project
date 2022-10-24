# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_05_18_184513) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.uuid "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "ambassador_profiles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "uid"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_ambassador_profiles_on_user_id"
  end

  create_table "boat_dates", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "boat_id"
    t.date "date"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "user_id"
    t.index ["boat_id"], name: "index_boat_dates_on_boat_id"
    t.index ["user_id"], name: "index_boat_dates_on_user_id"
  end

  create_table "boat_locations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "boat_id", null: false
    t.uuid "marina_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["boat_id"], name: "index_boat_locations_on_boat_id"
    t.index ["marina_id"], name: "index_boat_locations_on_marina_id"
  end

  create_table "boats", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "boat_type"
    t.string "make"
    t.string "model"
    t.string "year"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "length"
    t.integer "guest_count", default: 0
    t.string "city"
    t.string "state"
    t.string "title"
    t.text "description"
    t.boolean "fishing", default: false
    t.boolean "leisure", default: false
    t.boolean "watersports", default: false
    t.text "sub_activities"
    t.text "features"
    t.text "navigation"
    t.text "rules"
    t.text "guests_should_bring"
    t.float "price"
    t.text "time_increments"
    t.boolean "first_guests_discount", default: false
    t.string "cancellation_policy"
    t.boolean "rental", default: false
    t.string "insurance_file_name"
    t.text "extra_features"
    t.text "extra_navigation"
    t.text "extra_rules"
    t.boolean "available_weekends", default: false
    t.boolean "available_weekdays", default: false
    t.integer "weekday_start"
    t.integer "weekday_end"
    t.integer "weekend_start"
    t.integer "weekend_end"
    t.uuid "lake_id"
    t.boolean "public", default: false
    t.integer "security_deposit_amount"
    t.boolean "force_private", default: false
    t.boolean "tubing", default: false
    t.boolean "swimming", default: false
    t.boolean "floating", default: false
    t.boolean "cruising", default: false
    t.boolean "sunset_cruise", default: false
    t.boolean "special_moments", default: false
    t.boolean "wake_surfing", default: false
    t.boolean "wakeboarding", default: false
    t.boolean "foiling", default: false
    t.boolean "skiing", default: false
    t.boolean "bass", default: false
    t.boolean "crappie", default: false
    t.boolean "walleye", default: false
    t.boolean "trout", default: false
    t.boolean "catfish", default: false
    t.boolean "striper", default: false
    t.boolean "bow", default: false
    t.boolean "celebrity", default: false
    t.boolean "celebrity_requested", default: false
    t.boolean "bachelor", default: false
    t.text "custom_cancellation_policy"
    t.boolean "onboarding", default: true
    t.boolean "filet_package", default: false
    t.boolean "media_package", default: false
    t.integer "filet_package_price", default: 0
    t.integer "media_package_price", default: 0
    t.boolean "pro_hopper", default: false
    t.boolean "pro_hopper_approved", default: false
    t.boolean "celebrity_watersports", default: false
    t.boolean "celebrity_fishing", default: false
    t.index ["lake_id"], name: "index_boats_on_lake_id"
    t.index ["user_id"], name: "index_boats_on_user_id"
  end

  create_table "booking_events", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "description"
    t.string "title"
    t.uuid "booking_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "host_event"
    t.string "action"
    t.index ["booking_id"], name: "index_booking_events_on_booking_id"
  end

  create_table "bookings", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "boat_id", null: false
    t.datetime "date"
    t.integer "duration_in_hours"
    t.integer "start_time"
    t.integer "number_of_guests"
    t.text "goal_for_trip"
    t.string "stripe_payment_intent_id"
    t.string "status", default: "unconfirmed"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "decline_message"
    t.boolean "request_expired", default: false
    t.string "security_deposit_payment_intent_id"
    t.string "stripe_transfer_id"
    t.text "cancel_message"
    t.string "stripe_refund_id"
    t.integer "amount"
    t.integer "end_time"
    t.integer "number"
    t.uuid "marina_id"
    t.string "discount_code"
    t.float "discount_percentage"
    t.integer "custom_refund"
    t.boolean "media_package", default: false
    t.boolean "filet_package", default: false
    t.integer "discount_amount", default: 0
    t.index ["boat_id"], name: "index_bookings_on_boat_id"
    t.index ["marina_id"], name: "index_bookings_on_marina_id"
    t.index ["user_id"], name: "index_bookings_on_user_id"
  end

  create_table "bookmarks", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "boat_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["boat_id"], name: "index_bookmarks_on_boat_id"
    t.index ["user_id"], name: "index_bookmarks_on_user_id"
  end

  create_table "discount_useds", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.uuid "discount_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["discount_id"], name: "index_discount_useds_on_discount_id"
    t.index ["user_id"], name: "index_discount_useds_on_user_id"
  end

  create_table "discounts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.float "percentage"
    t.string "code"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "dollar_amount", default: false
    t.integer "amount", default: 0
    t.index ["user_id"], name: "index_discounts_on_user_id"
  end

  create_table "emails", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "email"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "gifts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "gift_type"
    t.string "size"
    t.string "address"
    t.string "city"
    t.string "state"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "address_two"
    t.string "zip"
    t.boolean "shipped", default: false
    t.index ["user_id"], name: "index_gifts_on_user_id"
  end

  create_table "guest_boats", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "boat_type"
    t.string "year"
    t.string "make"
    t.string "model"
    t.string "length"
    t.uuid "booking_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["booking_id"], name: "index_guest_boats_on_booking_id"
  end

  create_table "guest_locations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "address"
    t.string "lake_name"
    t.string "city"
    t.string "state"
    t.string "zip"
    t.uuid "booking_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["booking_id"], name: "index_guest_locations_on_booking_id"
  end

  create_table "lake_queries", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "lake"
    t.string "email"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "marinas", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "address"
    t.string "city"
    t.string "state"
    t.float "lat"
    t.float "lng"
    t.uuid "lake_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "approved", default: false
    t.string "address_two"
    t.string "zip"
    t.uuid "state_id"
    t.uuid "country_id"
    t.uuid "user_id"
    t.index ["country_id"], name: "index_marinas_on_country_id"
    t.index ["lake_id"], name: "index_marinas_on_lake_id"
    t.index ["state_id"], name: "index_marinas_on_state_id"
    t.index ["user_id"], name: "index_marinas_on_user_id"
  end

  create_table "password_resets", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "token"
    t.datetime "expire_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_password_resets_on_user_id"
  end

  create_table "pro_hopper_dates", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.date "date"
    t.uuid "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_pro_hopper_dates_on_user_id"
  end

  create_table "regions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.float "lat"
    t.float "lng"
    t.float "zoom"
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "approved", default: false
    t.string "old_id"
    t.string "type"
  end

  create_table "reviews", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "rating"
    t.text "message"
    t.uuid "booking_id", null: false
    t.boolean "host"
    t.uuid "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["booking_id"], name: "index_reviews_on_booking_id"
    t.index ["user_id"], name: "index_reviews_on_user_id"
  end

  create_table "tokens", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "key"
    t.text "metadata"
    t.datetime "expires_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.boolean "email_confirmed", default: false
    t.string "type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "onboard_completed", default: false
    t.string "first_name"
    t.string "last_name"
    t.string "phone_number"
    t.boolean "host", default: false
    t.integer "onboard_step", default: 0
    t.integer "onboard_sub_step", default: 0
    t.text "onboard_metadata"
    t.string "stripe_account_id"
    t.text "story"
    t.string "headline"
    t.string "license_number"
    t.boolean "admin", default: false
    t.date "date_of_birth"
    t.string "address"
    t.string "address_two"
    t.string "city"
    t.string "state"
    t.string "zip"
    t.string "ssn"
    t.string "stripe_customer_id"
    t.string "hear_about_us"
    t.uuid "ambassador_profile_id"
    t.boolean "sms_enabled", default: true
    t.integer "weekday_start"
    t.integer "weekday_end"
    t.integer "weekend_start"
    t.integer "weekend_end"
    t.boolean "available_weekends", default: false
    t.boolean "available_weekdays", default: false
    t.boolean "boat_only_onboard", default: false
    t.boolean "pro_hopper_onboard", default: false
    t.index ["ambassador_profile_id"], name: "index_users_on_ambassador_profile_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "ambassador_profiles", "users"
  add_foreign_key "boat_dates", "boats"
  add_foreign_key "boat_dates", "users"
  add_foreign_key "boat_locations", "boats"
  add_foreign_key "boat_locations", "marinas"
  add_foreign_key "boats", "regions", column: "lake_id"
  add_foreign_key "boats", "users"
  add_foreign_key "booking_events", "bookings"
  add_foreign_key "bookings", "boats"
  add_foreign_key "bookings", "marinas"
  add_foreign_key "bookings", "users"
  add_foreign_key "bookmarks", "boats"
  add_foreign_key "bookmarks", "users"
  add_foreign_key "discounts", "users"
  add_foreign_key "gifts", "users"
  add_foreign_key "guest_boats", "bookings"
  add_foreign_key "guest_locations", "bookings"
  add_foreign_key "marinas", "regions", column: "country_id"
  add_foreign_key "marinas", "regions", column: "lake_id"
  add_foreign_key "marinas", "regions", column: "state_id"
  add_foreign_key "marinas", "users"
  add_foreign_key "password_resets", "users"
  add_foreign_key "pro_hopper_dates", "users"
  add_foreign_key "reviews", "bookings"
  add_foreign_key "reviews", "users"
  add_foreign_key "users", "ambassador_profiles"
end
