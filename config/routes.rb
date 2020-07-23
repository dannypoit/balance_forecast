Rails.application.routes.draw do
  devise_for :users, :controllers => { registrations: 'registrations' }
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'static_pages#index'
  get '/privacy-policy', to: 'static_pages#privacy', as: 'privacy'
  get '/terms-of-use', to: 'static_pages#terms', as: 'terms'
  resources :entries, only: [:index, :create, :update, :destroy]
  resources :users, only: [:show, :update]
end
