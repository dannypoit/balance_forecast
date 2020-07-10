class EntriesController < ApplicationController
  before_action :authenticate_user!

  def index
    @entries = Entry.all
    @entry = Entry.new
  end

  def create
    # @entry = current_user.entries.create(entry_params)
    @entry = Entry.create(entry_params)
    if @entry.valid?
      redirect_to root_path
    else
      @entries = Entry.all  # when rendering index, this was nil
      render :index, status: :unprocessable_entity
    end
  end

  private

  def entry_params
    params.require(:entry).permit(:date, :description, :frequency, :amount)
  end
end
