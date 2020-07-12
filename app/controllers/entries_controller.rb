class EntriesController < ApplicationController
  before_action :authenticate_user!

  def index
    render json: Entry.where(user_id: current_user.id).order(:id)
  end

  def create
    @entry = current_user.entries.create(entry_params)
    if @entry.valid?
      redirect_to root_path
    else
      redirect_to root_path, alert: 'All fields must be filled out to add a new entry'
    end
  end

  def update
    entry = Entry.find(params[:id])
    entry.update_attributes(entry_params)
    render json: entry
  end

  private

  def entry_params
    params.require(:entry).permit(:date, :description, :frequency, :amount)
  end
end
