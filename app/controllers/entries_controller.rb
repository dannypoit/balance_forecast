class EntriesController < ApplicationController
  before_action :authenticate_user!

  def index
    entries_in_db = []
    entries_to_display = []
    max_date = Date.current.next_month(3)
    entries_in_db = Entry.where(user_id: current_user.id).order(:date).to_a
    entries_in_db.each do |entry_in_db|
      entries_to_display << {"date": entry_in_db.date, "description": entry_in_db.description, "frequency": entry_in_db.frequency, "amount": entry_in_db.amount, "id": entry_in_db.id, "user_id": entry_in_db.user_id}
    end
    entries_to_display.each do |entry_to_display|
      if entry_to_display[:date] <= max_date && entry_to_display[:frequency] == "weekly"
        entries_to_display << {"date": entry_to_display[:date] + 7, "description": entry_to_display[:description], "frequency": entry_to_display[:frequency], "amount": entry_to_display[:amount]}
      elsif entry_to_display[:date] <= max_date && entry_to_display[:frequency] == "bi-weekly"
        entries_to_display << {"date": entry_to_display[:date] + 14, "description": entry_to_display[:description], "frequency": entry_to_display[:frequency], "amount": entry_to_display[:amount]}
      elsif entry_to_display[:date] <= max_date && entry_to_display[:frequency] == "monthly"
        entries_to_display << {"date": entry_to_display[:date].next_month, "description": entry_to_display[:description], "frequency": entry_to_display[:frequency], "amount": entry_to_display[:amount]}
      elsif entry_to_display[:date] <= max_date && entry_to_display[:frequency] == "bi-monthly"
        entries_to_display << {"date": entry_to_display[:date].next_month(2), "description": entry_to_display[:description], "frequency": entry_to_display[:frequency], "amount": entry_to_display[:amount]}
      elsif entry_to_display[:date] <= max_date && entry_to_display[:frequency] == "quarterly"
        entries_to_display << {"date": entry_to_display[:date].next_month(3), "description": entry_to_display[:description], "frequency": entry_to_display[:frequency], "amount": entry_to_display[:amount]}
      elsif entry_to_display[:date] <= max_date && entry_to_display[:frequency] == "annually"
        entries_to_display << {"date": entry_to_display[:date].next_year, "description": entry_to_display[:description], "frequency": entry_to_display[:frequency], "amount": entry_to_display[:amount]}
      end
    end
    entries_to_display = entries_to_display.sort_by! { |entry| entry[:date] }
    render json: entries_to_display
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
