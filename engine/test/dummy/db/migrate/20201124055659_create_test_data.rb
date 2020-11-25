class CreateTestData < ActiveRecord::Migration[6.0]
  def change
    create_table :authors, comment: 'Authors contributing content to our site' do |t|
      t.string :first_name, comment: 'First name of the author'
      t.string :last_name, comment: 'Last name of the author'
      t.integer :specialty, comment: "This author's area of expertise"

      t.timestamps
    end

    create_table :articles, comment: 'Articles about interesting topics' do |t|
      t.string :title, comment: 'Title of the article'
      t.text :body, comment: 'Text of the article'
      t.references :author, comment: 'Author who wrote this article'

      t.timestamps
    end

    create_table :images, comment: 'Images of interesting subjects' do |t|
      t.string :title, comment: 'Title of the image'
      t.text :caption, comment: 'Caption describing the image'
      t.text :url, comment: 'URL where the image is hosted'
      t.references :author, comment: 'Author who uploaded this image'

      t.timestamps
    end

    create_table :comments, comment: 'Comments about content on our site' do |t|
      t.text :body, comment: 'Text of the comment'
      t.references :commentable, polymorphic: true, comment: 'Post to which this comment is attached'

      t.timestamps
    end
  end
end
