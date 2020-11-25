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

ActiveRecord::Schema.define(version: 2020_11_24_055659) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "articles", comment: "Articles about interesting topics", force: :cascade do |t|
    t.string "title", comment: "Title of the article"
    t.text "body", comment: "Text of the article"
    t.bigint "author_id", comment: "Author who wrote this article"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["author_id"], name: "index_articles_on_author_id"
  end

  create_table "authors", comment: "Authors contributing content to our site", force: :cascade do |t|
    t.string "first_name", comment: "First name of the author"
    t.string "last_name", comment: "Last name of the author"
    t.integer "specialty", comment: "This author's area of expertise"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "comments", comment: "Comments about content on our site", force: :cascade do |t|
    t.text "body", comment: "Text of the comment"
    t.string "commentable_type"
    t.bigint "commentable_id", comment: "Post to which this comment is attached"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["commentable_type", "commentable_id"], name: "index_comments_on_commentable_type_and_commentable_id"
  end

  create_table "images", comment: "Images of interesting subjects", force: :cascade do |t|
    t.string "title", comment: "Title of the image"
    t.text "caption", comment: "Caption describing the image"
    t.text "url", comment: "URL where the image is hosted"
    t.bigint "author_id", comment: "Author who uploaded this image"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["author_id"], name: "index_images_on_author_id"
  end

end
