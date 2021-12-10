import React, {Fragment} from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {ButtonToggle, FormGroup, Input, Label, Modal, ModalHeader} from "reactstrap";

export default class show extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      house: this.props.house,
      user: this.props.user,
      flats: this.props.flats,
      openedModal: '',
      createFlat: {
        name: '',
        owner: '',
        phone: ''
      },
      editFlat: {}
    };
  }

  handleModal = (modal, i) => {
    if (i >=0) {
      this.setState({
        ...this.state,
        openedModal: modal,
        editFlat: {
          id: this.state.flats[i].id,
          name: this.state.flats[i].name,
          owner: this.state.flats[i].owner,
          phone: this.state.flats[i].phone
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

  submitFlat = (modal) => {
    $.ajax({
      url: this.state.openedModal === 'editFlat' ? `/flats/${this.state.editFlat.id}.json` : '/flats.json',
      type: this.state.openedModal === 'editFlat' ? 'PATCH' : 'POST',
      data: {
        flat: {
          name: this.state[this.state.openedModal].name,
          owner: this.state[this.state.openedModal].owner,
          phone: this.state[this.state.openedModal].phone,
          house_id: this.state.house.id
        }
      }
    }).then((resp) => {
      if (resp.success) {
        this.setState({
          ...this.state,
          openedModal: '',
          flats: resp.flats
        });
        modal === 'editFlat' ? NotificationManager.success('Квартиру змінено') : NotificationManager.success('Квартиру додано');
      } else {
        NotificationManager.error(resp.error, 'Неможливо зробити дію');
      }
    });
  };

  deleteFlat = (flat) => {
    if (window.confirm("Видалити квартиру?")) {
      $.ajax({
        url: `/flats/${flat.id}.json`,
        type: 'DELETE'
      }).then((resp) => {
        if (resp.success) {
          this.setState({
            ...this.state,
            flats: resp.flats
          });
          NotificationManager.success('Квартиру видалено');
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
        <h1 style={{marginBottom: 20+'px'}}>Будинок {this.state.house.name}</h1>
        <div className='row'>
          <div className='col-6'>
            <ButtonToggle color="primary" onClick={() => this.handleModal('createFlat')} style={{width: '100%'}}>
              Додати квартиру
            </ButtonToggle>
          </div>
        </div>
        <table className='dark' style={{marginTop: 20 + 'px'}}>
          <thead>
          <tr>
            <th><h1>Квартира</h1></th>
            <th><h1>Власник</h1></th>
            <th><h1>Телефон</h1></th>
            <th><h1>Статус</h1></th>
            <th><h1>Дії</h1></th>
          </tr>
          </thead>
          <tbody>
          { this.state.flats.map((flat, i) => {
            return (
              <tr key={i}>
                <td><a style={{color: '#FB667A'}} href={`/flats/${flat.id}`}>{flat.name}</a></td>
                <td>{flat.owner}</td>
                <td><a href={`tel:${flat.phone}`}>{flat.phone}</a></td>
                <td style={{color: flat.status ? 'red' : 'green'}}>{flat.status ? 'Борг' : 'Оплачено'}</td>
                <td>
                  <ButtonToggle style={{width: '100%'}} color="primary" size="sm" onClick={() => location.href = `/flats/${flat.id}`}>
                    Деталі
                  </ButtonToggle>
                  <ButtonToggle style={{width: '100%'}} color="warning" size="sm" onClick={() => this.handleModal('editFlat', i)}>
                    Змінити
                  </ButtonToggle>
                  <ButtonToggle style={{width: '100%'}} color="danger" size="sm" onClick={() => this.deleteFlat(flat)}>
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
            <ModalHeader>{this.state.openedModal == 'editFlat' ? 'Змінити квартиру' : 'Додати квартиру'}</ModalHeader>
            <div className='row'>
              <div className='col-12'>
                <FormGroup>
                  <Label>Ім'я</Label>
                  <Input type='text' value={this.state[this.state.openedModal].name}
                         onChange={(e) => this.handleInputChange(this.state.openedModal, 'name', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Власник</Label>
                  <Input type='text' value={this.state[this.state.openedModal].owner}
                         onChange={(e) => this.handleInputChange(this.state.openedModal, 'owner', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Телефон</Label>
                  <Input type='text' value={this.state[this.state.openedModal].phone}
                         onChange={(e) => this.handleInputChange(this.state.openedModal, 'phone', e.target.value)}
                  />
                </FormGroup>
              </div>
            </div>
            <FormGroup>
              <ButtonToggle color="secondary" onClick={() => this.handleModal('')}>Відміна</ButtonToggle>
              <ButtonToggle color="success" onClick={(e) => this.submitFlat(this.state.openedModal)}>
                Зберегти
              </ButtonToggle>
            </FormGroup>
          </div>
        </Modal>}
      </div>
    );
  }
}
