import React, {Fragment} from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {ButtonToggle, FormGroup, Input, Label, Modal, ModalHeader} from "reactstrap";

export default class Price extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      price: this.props.price
    };
  }

  handleInputChange = (field, value) => {
    this.setState({
      ...this.state,
      price: {
        ...this.state.price,
        [field]: value
      }
    })
  }

  submitPrice = () => {
    $.ajax({
      url: `/prices.json`,
      type: 'PATCH',
      data: {
        price: {
          water_price: this.state.price.water_price,
          sewerage_price: this.state.price.sewerage_price
        }
      }
    }).then((resp) => {
      if (resp.success) {
        this.setState({
          ...this.state,
          price: resp.price
        });
        NotificationManager.success('Ціну змінено');
      } else {
        NotificationManager.error(resp.error, 'Неможливо зробити дію');
      }
    });
  };

  render() {
    console.log(this.state)
    return (
      <div className='container page-content' style={{color: 'black'}}>
        <NotificationContainer/>
        <h1 style={{marginBottom: 20+'px'}}>Ціни</h1>
        <div className='row'>
          <div className='col-6'>
            <FormGroup>
              <Label>Ціна за воду</Label>
              <Input type='number' step={1} value={this.state.price.water_price}
                     onChange={(e) => this.handleInputChange( 'water_price', e.target.value)}
              />
            </FormGroup>
          </div>
          <div className='col-6'>
            <FormGroup>
              <Label>Ціна за каналізацію</Label>
              <Input type='number' step={1} value={this.state.price.sewerage_price}
                     onChange={(e) => this.handleInputChange( 'sewerage_price', e.target.value)}
              />
            </FormGroup>
          </div>
        </div>
        <FormGroup>
          <ButtonToggle color="success" onClick={() => this.submitPrice()}>
            Зберегти
          </ButtonToggle>
        </FormGroup>
      </div>
    );
  }
}
