# Seed data so that polymorphic relationships can be shown properly

author = Author.create!

article = Article.create!(author: author)
image = Image.create!(author: author)

Comment.create!(commentable: article)
Comment.create!(commentable: image)
