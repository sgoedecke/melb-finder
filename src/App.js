import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import logo from './logo.svg';
import './App.css';

const App = () => (
      <div className="App">
        <Finder API_ENDPOINT='https://data.melbourne.vic.gov.au/resource/6fzs-45an.json' />
      </div>
  )

class Finder extends React.Component{
  constructor(props) {
    super();
    this.state = {
      latitude: "calculating...",
      longitude: "calculating...",
      radius: "0.04",
      nearbyAttractions: [],
      searching: false
      };

  };

  search = () => {
    this.setState({searching: true});
    navigator.geolocation.getCurrentPosition(this.setLocation);
  };

  setAttractions = (data) => {
    console.log(data)
    console.log(this.state.radius)
    let nearbyAttractions = [];
    data.forEach( (item) => {
      if (this.isNearby(this.state.radius, item, this.state.latitude, this.state.longitude)) {
        nearbyAttractions.push(item);
      }
    });
    this.setState({searching: false, nearbyAttractions: nearbyAttractions});
  };

  isNearby = (radius, item, latitude, longitude) => {
    return ((Math.abs(item.geom.latitude - latitude) < radius) && (Math.abs(item.geom.longitude - longitude) < radius))
  };

  findAttractions = () => {
    console.log("Making API call...")
    $.getJSON(this.props.API_ENDPOINT).then(this.setAttractions)
  };

  setLocation = (position) => {
    this.setState({latitude: position.coords.latitude, longitude: position.coords.longitude});
    navigator.geolocation.getCurrentPosition(this.findAttractions);
    this.findAttractions();
  };

  render() {
    return (
      <div>
        <h1>ATTRACTION FINDER</h1>


        <h2>Look how far out?</h2>
        <input type='text' defaultValue ='0.04' onChange={ (e) => {
          console.log(e.target.value)
          this.setState({radius: e.target.value});
        } } />

        <button onClick={this.search} disabled={this.state.searching}> Search! </button>

        <h2>{this.state.nearbyAttractions.length} found:</h2>
        {
          this.state.nearbyAttractions.map( (item) => {
          return(
            <Location key={_.uniqueId()} {...item} />
          )
        }) }

    </div>)
  };
};

class Location extends React.Component {
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
      <div className='item-box' onClick={this.toggleDisplay}>
        <h2>{props.name}</h2>
        <h3>Artist: {props.artist}</h3>
        {
        this.state.expanded &&
        <div>
        <p>Description: {props.structure_}</p>
        <p>Address: {props.addresspt}</p>
        <p>Date: {props.artdate}</p>
        </div>
        }
        {!this.state.expanded &&
          <p>...</p>
        }

      </div>
  )};
}

export default App;
