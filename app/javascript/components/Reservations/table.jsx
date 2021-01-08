import React, {Fragment} from 'react';
import { Modal, ModalHeader, FormGroup, Label, Input, ButtonToggle } from 'reactstrap';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import AirBnbPicker from '../common/AirBnbPicker';
import moment from "moment";

export default class Table extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actions: this.props.reservations,
      openedModal: '',
      selectedAction: '',
      startDate: moment().clone().startOf('month').format('DD.MM.YYYY'),
      endDate: moment().clone().endOf('month').format('DD.MM.YYYY')
    };
  }

  handleModal = (modal, index) => {
    this.setState({
      ...this.state,
      openedModal: modal,
      selectedAction: index
    })
  };

  handleDateChange = ({startDate, endDate}) => {
    $.ajax({
      url: '/table.json',
      type: 'GET',
      data: {
        start_date: startDate.format('DD.MM.YYYY'),
        end_date: endDate.format('DD.MM.YYYY')
      },
      success: (resp) => {
        this.setState({
          ...this.state,
          actions: resp.reservations,
          startDate: startDate ? startDate.format('DD.MM.YYYY') : null,
          endDate: endDate ? endDate.format('DD.MM.YYYY') : null
        });
      }
    });
  };

  summary = () => {
    let sumArray = [];
    this.state.actions.map((action, index) => {
      return sumArray.push(parseFloat(action.price))
    });
    return (sumArray.reduce((a, b) => a + b, 0)).toFixed(2)
  };

  render() {
    console.log(this.state)
    return (
      <div className='container page-content' style={{color: 'black'}}>
        <NotificationContainer/>
        <h1>Записи</h1>
        <hr/>
        <div className='date-header'>
          <h1>{this.summary()}<span className='uah'>₴</span></h1>
          <AirBnbPicker
            single={false}
            pastDates={true}
            oneDay={true}
            onPickerApply={this.handleDateChange}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
          />
        </div>
        <table className='dark' style={{marginTop: 20 + 'px'}}>
          <thead>
          <tr>
            <th><h1>Клієнт</h1></th>
            <th><h1>Сума</h1></th>
            <th><h1>Дата</h1></th>
            <th><h1>Послуги</h1></th>
          </tr>
          </thead>
          <tbody>
          { this.state.actions.map((action, i) => {
            return (
              <tr key={i}>
                <td><a href={`/users?id=${action.user.id}`}>{action.user.name}</a></td>
                <td>{action.price}<span className='uah'>₴</span></td>
                <td>{action.created_at}</td>
                <td>
                  <ButtonToggle color="primary" size="sm" onClick={() => this.handleModal('actionModal', i)}>Деталі</ButtonToggle>
                </td>
              </tr>
            )
          })}
          </tbody>
        </table>
        <br/>

        { (this.state.openedModal === 'actionModal') &&
        <Modal isOpen={this.state.openedModal === 'actionModal'} toggle={() => this.handleModal('')} size="lg" className='show-action-details'>
          <div className='container'>
            <ModalHeader>Послуги</ModalHeader>
            <table className='dark' style={{marginTop: 20 + 'px'}}>
              <thead>
              <tr>
                <th><h1>Назва</h1></th>
                <th><h1>Дата</h1></th>
              </tr>
              </thead>
              <tbody>
              { this.state.actions[this.state.selectedAction].services.map((s, i) => {
                return (
                  <tr key={i}>
                    <td>{s.name}</td>
                    <td>{this.state.actions[this.state.selectedAction].created_at}</td>
                  </tr>
                )
              })}
              </tbody>
            </table>
            <h1>Всього: {this.state.actions[this.state.selectedAction].price}<span className='uah'>₴</span></h1>
            <FormGroup>
              <ButtonToggle color="secondary" onClick={() => this.handleModal('')}>Закрити</ButtonToggle>
            </FormGroup>
          </div>
        </Modal>}
      </div>
    );
  }
}
