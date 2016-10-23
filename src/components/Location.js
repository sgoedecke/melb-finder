import React from 'react';
import { getDistance } from 'geolib';


export class Location extends React.Component {
  constructor(props) {
    super(props);
    this.state = {expanded: false}
  };
  toggleDisplay = () => {
    if (this.state.expanded) {
      this.setState({expanded: false})
    } else {
      this.setState({expanded: true})
    }
  };

  render() {
    const props = this.props;
    return(
      <div className='item-wrapper'>
        <div className='item-box' onClick={this.toggleDisplay}>
          <strong>{props.name}</strong>
          <p>Artist: {props.artist}</p>

          <p>Distance: {getDistance(
            {latitude: props.userLatitude,
            longitude: props.userLongitude},
            {latitude: props.geom.latitude,
            longitude: props.geom.longitude})} meters</p>
          {
          this.state.expanded &&
          <div>
          <p>Description: {props.structure_}</p>
          <p>Address: {props.addresspt}</p>
          <p>Date: {props.artdate}</p>
          <p><a target="_blank" href={"http://maps.google.com/maps/place/"+props.geom.latitude+","+props.geom.longitude}>View on Google Maps</a></p>
          </div>
          }
          {!this.state.expanded &&
            <p>...</p>
          }

        </div>
      </div>
  )};
}
