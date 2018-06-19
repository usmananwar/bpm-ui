import React, { Component, Fragment } from 'react';
import logo from './logo.svg';
import './App.css';

import { detectPlatform } from './system';

import PropTypes from 'prop-types';

import data from './sample.json';





class MainComponent extends Component {


  constructor (props) {
    super(props);
    const {settings, errors} = loadSettings();
    //mapReduceFunction();

  
    
  }

  render() {
    return (
      <div>        
        <div>

          
          
        </div>
      </div>
    );    
  }


}



function getDefaultValues (jsonSettings) {

  const defaults = Object.keys(jsonSettings).reduce((data, section) => {   

    data[section] = Object.keys(jsonSettings[section]).filter(key => jsonSettings[section][key].default !== undefined)

    .reduce((d, key) => {  d[key] = jsonSettings[section][key].default;      
      return d;
    }, {});
    return data;
  }, {});
  defaults.__internal.platform = detectPlatform();






  var returnedValue;
    Object.keys(jsonSettings).forEach(section => {
      Object.keys(jsonSettings[section]).forEach(key => {
        Object.keys(jsonSettings[section][key]).forEach(prop => {
            console.log(key);          
        });
      });
    });










  return defaults;

}





function mapReduceFunction() {
  const defaultValues = getDefaultValues(data);
  try {   
    

    var anArray = [1,2,3,4,5,6,7,8,9,10];


    var evenNumbers = anArray.filter(number=> number%2===0);
    console.log(evenNumbers);

    var squaredArray = anArray.map(number=> number*number);
    console.log(squaredArray);

    var reducedValue = anArray.reduce(((acc,num) =>  acc + num), 0);

    console.log(reducedValue);


    




    
  } catch (e) {
    console.warn(e);
  }
}

function loadSettings () {
  const defaultSettings = getDefaultValues(data);
  

  defaultSettings.parity.chain = 'kovan';
  return {settings: defaultSettings, errors: []};
}










export default MainComponent;
