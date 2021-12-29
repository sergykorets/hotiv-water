import React, {Fragment} from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {ButtonToggle, FormGroup, Input, Label, Modal, ModalHeader} from "reactstrap";
import Picker from 'react-month-picker'
import Datetime from "react-datetime";
import moment from 'moment'

export default class show extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: this.props.user,
      flat: this.props.flat,
      consumptions: this.props.consumptions,
      openedModal: '',
      createConsumption: {
        water: this.props.consumptions[0] ? this.props.consumptions[0].water : 0,
        date: this.props.consumptions[0] ? {year: parseInt(this.props.consumptions[0].date.split('-')[0]), month: parseInt(this.props.consumptions[0].date.split('-')[1]) + 1} : {year: new Date().getFullYear(), month: new Date().getMonth() + 1},
        status: 'not_paid'
      },
      editConsumption: {},
      year: moment(),
      total_paid: this.props.total_paid,
      total_owe: this.props.total_owe,
      openedConsumption: ''
    };

    this.pickAMonth = React.createRef()
    this.pickAYear= React.createRef()
  }

  handleModal = (modal, i) => {
    if (i >=0) {
      this.setState({
        ...this.state,
        openedModal: modal,
        editConsumption: {
          id: this.state.consumptions[i].id,
          date: {
            year: parseInt(this.state.consumptions[i].date.split("-")[0]),
            month: parseInt(this.state.consumptions[i].date.split("-")[1])
          },
          sewerage_price: this.state.consumptions[i].sewerage_price,
          status: this.state.consumptions[i].status,
          water: this.state.consumptions[i].water,
          water_price: this.state.consumptions[i].water_price
        },
        openedConsumption: i
      })
    } else {
      this.setState({
        ...this.state,
        openedModal: modal,
        openedConsumption: ''
      })
    }
  };

  handleClickMonthBox = () => {
    this.pickAMonth.current.show()
  }

  handleAMonthChange = (year, month) => {
    this.setState({
      ...this.state,
      [this.state.openedModal]: {
        ...this.state[this.state.openedModal],
        date: {year: year, month: month}
      }
    })
  }

  handleInputChange = (modal, field, value) => {
    this.setState({
      ...this.state,
      [modal]: {
        ...this.state[modal],
        [field]: value
      }
    })
  }

  submitConsumption = (modal) => {
    $.ajax({
      url: this.state.openedModal === 'editConsumption' ? `/consumptions/${this.state.editConsumption.id}.json` : '/consumptions.json',
      type: this.state.openedModal === 'editConsumption' ? 'PATCH' : 'POST',
      data: {
        consumption: {
          water: this.state[this.state.openedModal].water,
          date: `${this.state[this.state.openedModal].date.year}-${this.state[this.state.openedModal].date.month}-28`,
          status: this.state[this.state.openedModal].status,
          flat_id: this.state.flat.id
        }
      }
    }).then((resp) => {
      if (resp.success) {
        this.setState({
          ...this.state,
          openedModal: '',
          consumptions: resp.consumptions,
          total_paid: resp.total_paid,
          total_owe: resp.total_owe
        });
        modal === 'editConsumption' ? NotificationManager.success('Показники змінено') : NotificationManager.success('Показники додано');
      } else {
        NotificationManager.error(resp.error, 'Неможливо зробити дію');
      }
    });
  };

  setYear = (date) => {
    $.ajax({
      url: `/flats/${this.state.flat.id}.json`,
      type: 'GET',
      data: {
        year: date.year()
      },
      success: (resp) => {
        if (resp.success) {
          this.setState({
            ...this.state,
            consumptions: resp.consumptions,
            year: date,
            total_paid: resp.total_paid,
            total_owe: resp.total_owe
          });
        } else {
          NotificationManager.error(resp.error, "Неможливо зробити дію");
        }
      }
    });
  }

  render() {
    console.log(this.state)
    const monthNames = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
      "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
    ];
    const statusNames = {paid: 'Оплачено', not_paid: 'Борг'};
    const makeText = m => {
      if (m && m.year && m.month) return (monthNames[m.month-1] + ' ' + m.year)
      return '?'
    }
    return (
      <div className='container page-content' style={{color: 'black'}}>
        <NotificationContainer/>
        <hr/>
        <h1 style={{marginBottom: 20+'px'}}>
          <a className='phone' href={`/houses/${this.props.house.id}`}>{this.props.house.name}</a> - {this.state.flat.name}
        </h1>
        <hr/>
        <div className='row'>
          <div className='col-6'>
            <h1 style={{marginBottom: 20+'px'}}>{this.state.flat.owner}</h1>
          </div>
          <div className='col-6'>
            <h1 style={{color: 'green'}}>Сплачено: {this.state.total_paid} ₴</h1>
          </div>
        </div>
        <div className='row'>
          <div className='col-6'>
            <h1 style={{marginBottom: 20+'px'}}><a className='phone' href={`tel:${this.state.flat.phone}`}>{this.state.flat.phone}</a></h1>
          </div>
          <div className='col-6'>
            <h1 style={{color: 'red'}}>Борг: {this.state.total_owe} ₴</h1>
          </div>
        </div>
        <hr/>
        <div className='row'>
          <div className='col-6'>
            <ButtonToggle color="primary" onClick={() => this.handleModal('createConsumption')} style={{width: '100%'}}>
              Додати показники
            </ButtonToggle>
          </div>
          <div className='col-6'>
            <Datetime dateFormat="YYYY" timeFormat={false} value={this.state.year} onChange={(date) => this.setYear(date)}/>
          </div>
        </div>
        <hr/>
        <table className='dark' style={{marginTop: 20 + 'px'}}>
          <thead>
          <tr>
            <th><h1>Лічильник</h1></th>
            <th><h1>Вода</h1></th>
            <th><h1>Каналізація</h1></th>
            <th><h1>Статус</h1></th>
            <th><h1>Місяць</h1></th>
            <th><h1>Сума</h1></th>
            <th><h1>Дії</h1></th>
          </tr>
          </thead>
          <tbody>
          { this.state.consumptions.map((consumption, i) => {
            return (
              <tr key={i}>
                <td>{parseFloat(consumption.water)}</td>
                <td>{parseFloat(consumption.water_price)} ₴</td>
                <td>{parseFloat(consumption.sewerage_price)} ₴</td>
                <td style={{color: consumption.status == 'paid' ? 'green' : 'red'}}>{statusNames[consumption.status]}</td>
                <td>{monthNames[parseInt(consumption.date.split("-")[1],  10) - 1]}</td>
                <td>{parseFloat(consumption.water_price) + parseFloat(consumption.sewerage_price)} ₴</td>
                <td>
                  <ButtonToggle color="warning" size="sm" onClick={() => this.handleModal('editConsumption', i)}>
                    Змінити
                  </ButtonToggle>
                </td>
              </tr>
            )
          })}
          </tbody>
        </table>
        { this.state.openedModal.length > 0 &&
        <Modal isOpen={this.state.openedModal.length > 0} toggle={() => this.handleModal('')} size="lg">
          <div className='container'>
            <ModalHeader>{this.state.openedModal == 'editConsumption' ? 'Змінити показники' : 'Додати показники'}</ModalHeader>
            <div className='row'>
              <div className='col-12'>
                <FormGroup>
                  <Label>Лічильник</Label>
                  <Input type='number' step={1} value={this.state[this.state.openedModal].water}
                         onChange={(e) => this.handleInputChange(this.state.openedModal, 'water', e.target.value)}
                         disabled={this.state.consumptions.length > 1 && this.state.openedModal === 'editConsumption' && this.state.openedConsumption > 0}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Статус</Label>
                  <Input type="select" name="status" id={`status_${this.state.openedModal}`}
                         defaultValue={this.state[this.state.openedModal].status}
                         onChange={(e) => this.handleInputChange(this.state.openedModal, 'status', e.target.value)}>
                    <option key={0} value='paid'>Оплачено</option>
                    <option key={1} value='not_paid'>Борг</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Місяць</Label>
                  <div className="edit">
                    <Picker
                      className={this.state.consumptions.length > 1 && this.state.openedModal === 'editConsumption' && this.state.openedConsumption > 0 ? 'disabled' : 'enabled'}
                      ref={this.pickAMonth}
                      years={{min: {year: new Date().getFullYear(), month: 1}, max: {year: new Date().getFullYear(), month: 12}}}
                      value={this.state[this.state.openedModal].date}
                      lang={monthNames}
                      onChange={this.handleAMonthChange}
                    >
                      <Input value={makeText(this.state[this.state.openedModal].date)} onClick={this.handleClickMonthBox} />
                    </Picker>
                  </div>
                </FormGroup>
              </div>
            </div>
            <FormGroup>
              <ButtonToggle color="secondary" onClick={() => this.handleModal('')}>Відміна</ButtonToggle>
              <ButtonToggle color="success"
                            onClick={() => this.submitConsumption(this.state.openedModal)}>Зберегти</ButtonToggle>
            </FormGroup>
          </div>
        </Modal>}
      </div>
    );
  }
}
