import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import logo from './logo.svg';
import { getDistance } from 'geolib';
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
      latitude: "0",
      longitude: "0",
      radius: "0",
      displayedRadius: "0",
      nearbyAttractions: [],
      allAttractions: [],
      searching: false
      };
  };

  componentWillMount(){
    this.search();
  };

  search = () => {
    this.setState({searching: true, allAttractions: [], nearbyAttractions: []});
    navigator.geolocation.getCurrentPosition(this.setLocation);
  };

  filterAttractions = () => {
    let nearbyAttractions = [];
    this.state.allAttractions.forEach( (item) => {
      if (this.isNearby(this.state.radius, item, this.state.latitude, this.state.longitude)) {
        nearbyAttractions.push(item);
      }
    });
    this.setState({nearbyAttractions: nearbyAttractions});
  };

  isNearby = (radius, item, latitude, longitude) => {
    return ((Math.abs(item.geom.latitude - latitude) < radius) && (Math.abs(item.geom.longitude - longitude) < radius))
  };

  findAttractions = () => {
    console.log("Making API call...")
    $.getJSON(this.props.API_ENDPOINT).then((data) => {this.setState({allAttractions: data})})
    .then(this.filterAttractions)
    .then(this.setState({searching: false})).then(console.log("Finished API call."));
  };

  setLocation = (position) => {
    this.setState({latitude: position.coords.latitude, longitude: position.coords.longitude});
    this.findAttractions();
  };

  calculateDisplayedRadius = () => {
    const radius = getDistance(
        {latitude: this.state.latitude,
        longitude: this.state.longitude},
        {latitude: parseFloat(this.state.latitude) + parseFloat(this.state.radius),
        longitude: parseFloat(this.state.longitude) + parseFloat(this.state.radius)});
    this.setState({displayedRadius: radius});
  }

  render() {
    return (
      <div>
        <div className="bg-primary header-box">
          <h1>Spyglass</h1>
        </div>

        <div className= "bg-info app-box">
          <input type='range' min='0' max='0.09' defaultValue ='0' step='0.0001' onChange={ (e) => {
            this.setState({radius: e.target.value});
            this.calculateDisplayedRadius();
            this.filterAttractions();
          } } />
          <p>Search radius: { this.state.displayedRadius }m (approx.)</p>

          {
            (this.state.allAttractions.length == 0) &&
            <div>
              <h2>Searching...</h2>
            </div>
          }
          {
            (this.state.allAttractions.length > 0) &&
            <div>
              <button onClick={this.search} disabled={this.state.searching}> Search again... </button>
              <h2>Showing {this.state.nearbyAttractions.length} ({this.state.allAttractions.length} total):</h2>
            </div>
          }
          {
            this.state.nearbyAttractions.map( (item) => {
            return(
              <Location key={_.uniqueId()} userLatitude={this.state.latitude} userLongitude={this.state.longitude} {...item} />
            )
          }) }

        </div>

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
      <div className='item-wrapper'>
        <div className='item-box' onClick={this.toggleDisplay}>
          <h2>{props.name}</h2>
          <h3>Artist: {props.artist}</h3>

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
          </div>
          }
          {!this.state.expanded &&
            <p>...</p>
          }

        </div>
      </div>
  )};
}

export default App;
