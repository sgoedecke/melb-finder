import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import { Location } from './Location';
import { getDistance } from 'geolib';


export class Finder extends React.Component{
  constructor(props) {
    super();
    this.state = {
      latitude: "0",
      longitude: "0",
      radius: "0",
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

  setRadiusSlider = () => {
    // sets radius slider to the smallest radius where at least one
    // location is displayed
    const $slider = $('#radius-slider');
    var closestRadius = $slider.prop('max')
    var d;
    this.state.allAttractions.forEach( (item) => {
      d = getDistance(
        {latitude: item.geom.latitude,
      longitude: item.geom.longitude},
      {latitude: this.state.latitude,
      longitude: this.state.longitude});
      if (d < closestRadius) {
        closestRadius = d;
      }
    });
    closestRadius = closestRadius + 100;
    $slider.prop('value', closestRadius);
    this.setState({radius: closestRadius});
    this.filterAttractions();
  }

  isNearby = (radius, item, latitude, longitude) => {
    const distance = getDistance(
      {latitude: item.geom.latitude,
    longitude: item.geom.longitude},
    {latitude: latitude,
    longitude: longitude});
    return (distance < radius);
  };

  findAttractions = () => {
    console.log("Making API call...")
    $.getJSON(this.props.API_ENDPOINT).then((data) => {this.setState({allAttractions: data})})
    .then(this.filterAttractions)
    .then(this.setRadiusSlider)
    .then(this.setState({searching: false})).then(console.log("Finished API call."));
  };

  setLocation = (position) => {
    this.setState({latitude: position.coords.latitude, longitude: position.coords.longitude});
    this.findAttractions();
  };


  render() {
    return (
      <div>
        <div className="bg-primary header-box">
          <h1>Melbourne Public Artworks</h1>
        </div>

        <div className= "bg-info app-box">
          <input id='radius-slider' type='range' min='0' max='10000' defaultValue ='0' step='1' onChange={ (e) => {
            this.setState({radius: e.target.value});
            console.log("changing")
            this.filterAttractions();
          } } />
          <em>Search radius: { this.state.radius }m (approx.)</em>

          {
            (this.state.allAttractions.length == 0) &&
            <div>
              <strong>Searching...</strong>
            </div>
          }
          {
            (this.state.allAttractions.length > 0) &&
            <div>
              <button onClick={this.search} disabled={this.state.searching}> Search again...</button>
              <strong>  Showing {this.state.nearbyAttractions.length} ({this.state.allAttractions.length} total):</strong>
            </div>
          }
          <div className='attractions-list'>
            {
              this.state.nearbyAttractions.map( (item) => {
              return(
                <Location key={_.uniqueId()} userLatitude={this.state.latitude} userLongitude={this.state.longitude} {...item} />
              )
            })
          }
          </div>

        </div>

    </div>)
  };
};
