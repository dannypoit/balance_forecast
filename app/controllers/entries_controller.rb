class EntriesController < ApplicationController
  before_action :authenticate_user!

  def index
    # render json: Entry.where(user_id: current_user.id).order(:date)

    # problem with this is that array is only referencing ActiveRecord Relations
    # so when it creates new_entry and sets it to entry, it is just creating a duplicate reference to the same record in the db
    # ---
    entries = []
    entries = Entry.where(user_id: current_user.id).order(:date)
    entries = entries.to_a
    entries.each do |entry|
      if entry.frequency == "weekly" && entries.count < 100
        new_entry = entry
        new_entry.date = new_entry.date + 7
        entries << new_entry
      end
    end
    render json: entries
  end

  def create
    @entry = current_user.entries.create(entry_params)
    if @entry.valid?
      redirect_to root_path
    else
      redirect_to root_path, alert: 'All fields must be filled out with valid data to add a new entry'
    end
  end

  def update
    entry = Entry.find_by_id(params[:id])
    return render_not_found if entry.blank?
    return render_not_found(:forbidden) if entry.user != current_user
    entry.update_attributes(entry_params)
    if entry.valid?
      render json: entry
    else
      redirect_to root_path, alert: 'All fields must be filled out with valid data to update an entry'
    end
  end

  def destroy
    entry = Entry.find_by_id(params[:id])
    return render_not_found if entry.blank?
    return render_not_found(:forbidden) if entry.user != current_user
    entry.destroy
    redirect_to root_path
  end

  private

  def entry_params
    params.require(:entry).permit(:date, :description, :frequency, :amount)
  end
end
