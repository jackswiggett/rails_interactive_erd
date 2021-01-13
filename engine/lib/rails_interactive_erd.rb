require "rails_interactive_erd/engine"

# Allow host application to set configuration options for rails_interactive_erd
module RailsInteractiveErd
  # Title of the diagram
  mattr_accessor :title
  self.title = 'Interactive ERD'

  # Exclude specific models from the diagram
  mattr_accessor :excluded_model_names
  self.excluded_model_names = []

  # Provide a Proc to modify the column configuration on a case-by-case basis
  mattr_accessor :configure_column
  self.configure_column = proc { |column_config| column_config }

  # Stores configuration for a column of an entity
  class ColumnConfiguration
    ATTRIBUTES = %i[name type comment associations enum_values hide_edge].freeze

    attr_reader :model
    attr_accessor(*ATTRIBUTES)

    def initialize(model:, **attributes)
      @model = model

      attributes.each do |attribute, value|
        send "#{attribute}=", value
      end
    end

    def to_h
      ATTRIBUTES.to_h do |attribute|
        [attribute.to_s.camelize(:lower), send(attribute)]
      end
    end
  end

  class << self
    def setup
      yield self
    end
  end
end
