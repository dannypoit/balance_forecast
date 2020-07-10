class EntriesController < ApplicationController
  before_action :authenticate_user!

  def index
    @entries = Entry.all
    @entry = Entry.new
  end

  def create
    @entry = Entry.create(entry_params)
    redirect_to root_path
    # @entry = current_user.entries.create(entry_params)
    # if @post.valid?
    #   redirect_to root_path
    # else
    #   render :new, status: :unprocessable_entity
    # end
  end

  private

  def entry_params
    params.require(:entry).permit(:date, :description, :frequency, :amount)
  end
end
