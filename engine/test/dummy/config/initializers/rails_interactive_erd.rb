# Test configuration options for rails_interactive_erd

RailsInteractiveErd.setup do |config|
  config.title = 'Test ERD'

  config.excluded_model_names = []

  config.configure_column = proc do |column_config|
    case column_config.name
    when 'created_at'
      column_config.comment ||= 'Time at which this record was created'
    when 'updated_at'
      column_config.comment ||= 'Time at which this record was last updated'
    end
  end
end
