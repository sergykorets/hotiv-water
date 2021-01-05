import React, {Fragment} from 'react';
import { Modal, ModalHeader, FormGroup, Label, Input, ButtonToggle, Tooltip } from 'reactstrap';
import {NotificationContainer, NotificationManager} from 'react-notifications';


export default class Reservations extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reservations: this.props.reservations,
    };
  }

  render() {
    return (
      <div></div>
    );
  }
}
