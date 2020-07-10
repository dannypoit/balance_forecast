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
      render 'static_pages/index', status: :unprocessable_entity
    end
  end

  private

  def entry_params
    params.require(:entry).permit(:date, :description, :frequency, :amount)
  end
end
