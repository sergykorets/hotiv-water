class UsersController < ApplicationController

  def index
    @users = User.all.map { |user| {label: user.name, value: user.id} }
    respond_to do |format|
      format.json {{users: @users }}
    end
  end
end