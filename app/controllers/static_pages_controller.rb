class StaticPagesController < ApplicationController
  before_action :authenticate_user!

  def index
    @entry = Entry.new
  end
end