Rails.application.routes.draw do
  root 'houses#index'

  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  mount ActionCable.server => '/cable'

  devise_for :users, :controllers => { registrations: 'registrations' }
  resources :houses
  resources :flats
  resources :consumptions
  resources :prices, only: [:index] do
    patch :update, on: :collection
  end
end