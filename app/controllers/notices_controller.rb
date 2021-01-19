class NoticesController < ApplicationController

  def index
    notices = Notice.for_date(params[:date]).each_with_object({}) { |notice, hash|
      hash[notice.id] = { id: notice.id, body: notice.body, date: notice.date }
    }
    render json: {notices: notices}
  end

  def create
    notice = Notice.new(notice_params)
    if notice.save
      render json: { success: true,
        notices: Notice.for_date(notice_params[:date]).each_with_object({}) { |notice, hash|
          hash[notice.id] = { id: notice.id, body: notice.body, date: notice.date }
        }
      }
    else
      render json: {success: false, error: notice.errors.full_messages}
    end
  end

  def destroy
    notice = Notice.find(params[:id])
    notice.destroy
    render json: { success: true,
       notices: Notice.for_date(notice_params[:date]).each_with_object({}) { |notice, hash|
         hash[notice.id] = { id: notice.id, body: notice.body, date: notice.date }
       }
    }
  end

  private

  def notice_params
    params.require(:notice).permit(:body, :date)
  end
end