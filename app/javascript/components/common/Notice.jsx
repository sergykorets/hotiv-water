import React, {Fragment} from 'react';
import { MessageList, Button, Input } from 'react-chat-elements';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import moment from 'moment';


export default class Notice extends React.Component {
  constructor(props) {
    super(props);

    moment.locale('uk');

    this.state = {
      message: '',
      notices: this.props.notices
    };
  }

  sendMessage = () => {
    if (this.state.message.trim().length > 0) {
      $('.rce-input').val('');
      $.ajax({
        url: `notices.json`,
        type: 'POST',
        dataType: 'JSON',
        data: {
          notice: {
            body: this.state.message,
            date: moment(this.props.date).format('DD.MM.YYYY'),
          }
        },
        success: (resp) => {
          this.setState({
            ...this.state,
            notices: resp.notices,
            message: ''
          })
        }
      });
      NotificationManager.success('Нотатка створена');
    } else {
      NotificationManager.error('Нотатка не може бути пустою', 'Неможливо записати нотатку');
    }
  };

  handleInputChange = (text) => {
    this.setState({message: text})
  };

  handleKeyDown = (key) => {
    if (key === 'Enter') {
      this.sendMessage();
    }
  };

  deleteNotice = (notice) => {
    if (window.confirm(`Видалити нотатку (${notice.text})?`)) {
      $.ajax({
        url: `/notices/${notice.id}.json`,
        type: 'DELETE',
        data: {
          notice: {
            date: this.props.date
          }
        }
      }).then((resp) => {
        if (resp.success) {
          this.setState({
            ...this.state,
            notices: resp.notices
          })
          NotificationManager.success('Нотатку видалено');
        } else {
          NotificationManager.error(resp.error, 'Неможливо зробити дію');
        }
      });
    }
  };

  render() {
      return (
        <div className='container' style={{fontSize: 30+'px', padding: 20+'px'}}>
          <NotificationContainer/>
          <MessageList
            className='message-list'
            onClick={this.deleteNotice}
            dataSource={ Object.values(this.state.notices).map((message, i) => {
              return (
                { position: 'right',
                  type: 'text',
                  text: message.body,
                  dateString: 'Видалити',
                  id: message.id
                }
              )
            })}
          />
          <Input placeholder="Записати нову нотатку..."
                 defaultValue=''
                 onKeyDown={(e) => this.handleKeyDown(e.key)}
                 onChange={(e) => this.handleInputChange(e.target.value)}
                 rightButtons={
                   <Button
                     color='white'
                     backgroundColor='black'
                     text='Створити'
                     onClick={() => this.sendMessage()}
                   />
                 }
          />
        </div>
      )
  }
}