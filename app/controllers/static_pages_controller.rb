class StaticPagesController < ApplicationController
  before_action :authenticate_user!

  def index
    @entry = Entry.new
    @time_zone = TimeZone.all
  end
end
