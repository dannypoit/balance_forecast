class EntriesController < ApplicationController
  before_action :authenticate_user!

  def index
    entries_in_db = []
    entries_to_display = []
    months_to_display = current_user.months_to_display
    max_date = Date.current.next_month(months_to_display)
    entries_in_db = Entry.where(user_id: current_user.id).order(:date).to_a
    # add isEarliest boolean to each entry in entries_in_db, 
    # set to true for all (maybe leave one-time true / this shouldn't matter)
    entries_in_db.each do |entry|
      entries_to_display << {
        date: entry.date, 
        description: entry.description, 
        frequency: entry.frequency, 
        amount: entry.amount, 
        id: entry.id, 
        user_id: entry.user_id,
        isEarliest: true
      }
    end
    # refactor: set isEarliest to false for all subsequent recurring entries
    entries_to_display.each do |entry|
      if entry[:date] + 7 <= max_date && entry[:frequency] == "weekly"
        entries_to_display << {
          date: entry[:date] + 7, 
          description: entry[:description], 
          frequency: entry[:frequency], 
          amount: entry[:amount], 
          id: entry[:id], 
          user_id: entry[:user_id],
          isEarliest: false
        }
      elsif entry[:date] + 14 <= max_date && entry[:frequency] == "bi-weekly"
        entries_to_display << {
          date: entry[:date] + 14, 
          description: entry[:description], 
          frequency: entry[:frequency], 
          amount: entry[:amount], 
          id: entry[:id], 
          user_id: entry[:user_id],
          isEarliest: false
        }
      elsif entry[:date].next_month <= max_date && entry[:frequency] == "monthly"
        entries_to_display << {
          date: entry[:date].next_month, 
          description: entry[:description], 
          frequency: entry[:frequency], 
          amount: entry[:amount], 
          id: entry[:id], 
          user_id: entry[:user_id],
          isEarliest: false
        }
      elsif entry[:date].next_month(2) <= max_date && entry[:frequency] == "bi-monthly"
        entries_to_display << {
          date: entry[:date].next_month(2), 
          description: entry[:description], 
          frequency: entry[:frequency], 
          amount: entry[:amount], 
          id: entry[:id], 
          user_id: entry[:user_id],
          isEarliest: false
        }
      elsif entry[:date].next_month(3) <= max_date && entry[:frequency] == "quarterly"
        entries_to_display << {
          date: entry[:date].next_month(3), 
          description: entry[:description], 
          frequency: entry[:frequency], 
          amount: entry[:amount], 
          id: entry[:id], 
          user_id: entry[:user_id],
          isEarliest: false
        }
      elsif entry[:date].next_year <= max_date && entry[:frequency] == "annually"
        entries_to_display << {
          date: entry[:date].next_year, 
          description: entry[:description], 
          frequency: entry[:frequency], 
          amount: entry[:amount], 
          id: entry[:id], 
          user_id: entry[:user_id],
          isEarliest: false
        }
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
