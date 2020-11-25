require_dependency 'rails_interactive_erd/application_controller'

module RailsInteractiveErd
  class PagesController < ApplicationController
    def main
      # Must eager load classes in order to get list of all models
      Rails.application.eager_load! unless Rails.application.config.eager_load

      schema = {
        title: RailsInteractiveErd.title,
        entities: entities
      }

      render :main, locals: { schema: schema.to_json }
    end

    # Get information about all database entities (models)
    def entities
      # @see https://stackoverflow.com/a/36277614
      all_models = ApplicationRecord.descendants.sort_by(&:name)
      excluded_models = RailsInteractiveErd.excluded_model_names.map(&:constantize)

      (all_models - excluded_models).map do |model|
        {
          name: model.name,
          friendlyName: model.name.titlecase,
          comment: model_comment(model),
          columns: model_columns(model)
        }
      end
    end

    # Query PostgreSQL comments on all tables
    # @see https://stackoverflow.com/a/24178655
    def table_comments
      return @table_comments if @table_comments.present?

      sql = <<~SQL
        SELECT relname AS table_name, description AS comment
        FROM pg_description
        JOIN pg_class ON pg_description.objoid = pg_class.oid
        WHERE objsubid = 0
      SQL

      @table_comments = ActiveRecord::Base.connection.exec_query(sql)
    end

    # Get the comment for a given model
    def model_comment(model)
      table_comment = table_comments.find { |row| row['table_name'] == model.table_name }
      return nil if table_comment.blank?

      table_comment['comment']
    end

    # Get information about the columns for a given model
    def model_columns(model)
      model.columns.map do |column|
        column_config = ColumnConfiguration.new(
          model: model,
          name: column.name,
          type: column.sql_type,
          comment: column.comment,
          associations: column_associations(model, column),
          enum_values: model.defined_enums[column.name],
          hide_edge: false
        )

        RailsInteractiveErd.configure_column.call(column_config)

        column_config.to_h
      end
    end

    def column_associations(model, column)
      associations = model.reflect_on_all_associations(:belongs_to)

      associations
        .select { |association| association.foreign_key == column.name }
        .flat_map do |association|
          next association.class_name unless association.polymorphic?

          # Get all values of foreign_type that exist in the database, which correspond
          # to the models that this polymorphic association can reference
          model.distinct.pluck(association.foreign_type).compact
        end
        .select { |name| RailsInteractiveErd.excluded_model_names.exclude?(name) }
        .uniq
    end
  end
end
