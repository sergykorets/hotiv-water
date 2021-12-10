import React, {Fragment} from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {ButtonToggle, FormGroup, Input, Label, Modal, ModalHeader} from "reactstrap";

export default class Houses extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      houses: this.props.houses,
      user: this.props.user,
      createHouse: {
        name: '',
        sewerage: false
      },
      editHouse: {},
      openedModal: ''
    };
  }


  handleModal = (modal, i) => {
    if (i >=0) {
      this.setState({
        ...this.state,
        openedModal: modal,
        editHouse: {
          id: this.state.houses[i].id,
          name: this.state.houses[i].name,
          sewerage: this.state.houses[i].sewerage
        }
      })
    } else {
      this.setState({
        ...this.state,
        openedModal: modal
      })
    }
  };

  handleInputChange = (modal, field, value) => {
    this.setState({
      ...this.state,
      [modal]: {
        ...this.state[modal],
        [field]: value
      }
    })
  }

  submitHouse = (modal) => {
    $.ajax({
      url: modal === 'editHouse' ? `/houses/${this.state.editHouse.id}.json` : '/houses.json',
      type: modal === 'editHouse' ? 'PATCH' : 'POST',
      data: {
        house: {
          name: this.state[this.state.openedModal].name,
          sewerage: this.state[this.state.openedModal].sewerage
        }
      }
    }).then((resp) => {
      if (resp.success) {
        this.setState({
          ...this.state,
          openedModal: '',
          houses: resp.houses
        });
        modal === 'editHouse' ? NotificationManager.success('Будинок змінено') : NotificationManager.success('Будинок додано');
      } else {
        NotificationManager.error(resp.error, 'Неможливо зробити дію');
      }
    });
  };

  deleteHouse = (house) => {
    if (window.confirm("Видалити будинок?")) {
      $.ajax({
        url: `/houses/${house.id}.json`,
        type: 'DELETE'
      }).then((resp) => {
        if (resp.success) {
          this.setState({
            ...this.state,
            houses: resp.houses
          });
          NotificationManager.success('Будинок видалено');
        } else {
          NotificationManager.error(resp.error, 'Неможливо зробити дію');
        }
      });
    }
  };

  render() {
    console.log(this.state)
    return (
      <div className='container page-content' style={{color: 'black'}}>
        <NotificationContainer/>
        <h1 style={{marginBottom: 20+'px'}}>Будинки</h1>
        <div className='row'>
          <div className='col-6'>
            <ButtonToggle color="primary" onClick={() => this.handleModal('createHouse')} style={{width: '100%'}}>
              Додати будинок
            </ButtonToggle>
          </div>
        </div>
        <table className='dark' style={{marginTop: 20 + 'px'}}>
          <thead>
          <tr>
            <th><h1>Ім'я</h1></th>
            <th><h1>Каналізація</h1></th>
            <th><h1>Дії</h1></th>
          </tr>
          </thead>
          <tbody>
          { this.state.houses.map((house, i) => {
            return (
              <tr key={i}>
                <td>{house.name}</td>
                <td style={{color: house.sewerage ? 'green' : 'red'}}>{house.sewerage ? 'Присутня' : 'Відсутня'}</td>
                <td>
                  <ButtonToggle color="primary" size="sm" onClick={() => location.href = `/houses/${house.id}`}>
                    Деталі
                  </ButtonToggle>
                  <ButtonToggle color="warning" size="sm" onClick={() => this.handleModal('editHouse', i)}>
                    Змінити
                  </ButtonToggle>
                  <ButtonToggle color="danger" size="sm" onClick={() => this.deleteHouse(house)}>
                    Видалити
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
            <ModalHeader>{this.state.openedModal === 'editHouse' ? 'Змінити будинок' : 'Додати будинок'}</ModalHeader>
            <div className='row'>
              <div className='col-12'>
                <FormGroup>
                  <Label>Ім'я</Label>
                  <Input type='text' value={this.state[this.state.openedModal].name}
                         onChange={(e) => this.handleInputChange(this.state.openedModal, 'name', e.target.value)}
                  />
                </FormGroup>
              </div>
            </div>
            <div className='row'>
              <div className='col-12'>
                <FormGroup style={{backgroundColor: this.state[this.state.openedModal].sewerage ? 'green' : 'red'}}>
                  <Label check>
                    <Input type="checkbox" value={this.state[this.state.openedModal].sewerage} defaultChecked={this.state[this.state.openedModal].sewerage} checked={this.state[this.state.openedModal].sewerage} onChange={() => this.handleInputChange(this.state.openedModal, 'sewerage', !this.state[this.state.openedModal].sewerage)}/>
                    Каналізація
                  </Label>
                </FormGroup>
              </div>
            </div>
            <FormGroup>
              <ButtonToggle color="secondary" onClick={() => this.handleModal('')}>Відміна</ButtonToggle>
              <ButtonToggle color="success" onClick={(e) => this.submitHouse(this.state.openedModal)}>
                Зберегти
              </ButtonToggle>
            </FormGroup>
          </div>
        </Modal>}
      </div>
    );
  }
}
