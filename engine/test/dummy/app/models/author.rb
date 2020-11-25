class Author < ApplicationRecord
  has_many :articles, dependent: :destroy
  has_many :images, dependent: :destroy

  enum specialty: { history: 0, geography: 1, art: 2, ecology: 3 }
end
