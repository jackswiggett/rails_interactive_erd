class Image < ApplicationRecord
  belongs_to :author
  has_many :comments, as: :commentable
end
