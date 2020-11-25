module RailsInteractiveErd
  class Engine < ::Rails::Engine
    isolate_namespace RailsInteractiveErd

    initializer 'rails_interactive_erd.assets.precompile' do |app|
      app.config.assets.precompile += %w[rails_interactive_erd_manifest.js]
    end
  end
end
