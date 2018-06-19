import React, { Component, Fragment } from 'react';
import isEqual from 'lodash.isequal';

//import TopBar from './components/TopBar';
//import Modal from './components/Modal';
import Editor from './components/Editor';
//import Preview from './components/Preview';
//import Presets from './components/Presets';

import { detectPlatform } from './system';
import data from './parity_settings.json';

function loadFromURL () {
  const hash = window.location.hash;
  if (!hash.startsWith('#config=')) {
    return null;
  }

  try {
    const config = hash.split('=')[1];
    return JSON.parse(window.atob(config));
  } catch (e) {
    console.warn('Error parsing config from URL: ', e);
    return null;
  }
}

function loadFromLocalStorage () {
  try {
    return JSON.parse(window.localStorage.getItem('last-config'));
  } catch (e) {
    window.localStorage.setItem('last-config', null);
    return null;
  }
}

function loadSettings () {
  const defaultSettings = generateDefaults(data);
  const settings = data;

  defaultSettings.parity.chain = 'kovan';
  return {settings, errors: []};
}

function saveSettings (settings) {
  const defaultSettings = generateDefaults(data);
  const cloned = JSON.parse(JSON.stringify(settings));

  Object.keys(defaultSettings).forEach(section => {
    Object.keys(defaultSettings[section]).forEach(prop => {
      if (isEqual(cloned[section][prop], defaultSettings[section][prop])) {
        delete cloned[section][prop];
      }
    });

    if (Object.keys(cloned[section]).length === 0) {
      delete cloned[section];
    }
  });

  const json = JSON.stringify(cloned);
  try {
    window.localStorage.setItem('last-config', json);
    window.location.hash = 'config=' + window.btoa(json);
  } catch (e) {
  }
}

class App extends Component {

  constructor (props) {
    super(props);

    const {settings, errors} = loadSettings();

    let modal;
    if (!errors.length) {
      modal = {visible: false};
    } else {
      let lis = errors.map(({section, prop, value, type, expected}, i) =>
        (<li key={i}><em>{section}.{prop}</em> has value <em>{JSON.stringify(value)}</em> of type <em>{type}</em>; expected type <em>{expected}</em></li>));
      modal = {
        visible: true,
        title: 'Warning',
        content: (
          <Fragment>
            <p>{lis.length > 1 ? 'Some items' : 'An item'} couldn't be parsed from the loaded config:</p>
            <ul>{lis}</ul>
          </Fragment>
        )
      };
    }
    this.state = {
      display_sections : {
        "GENERAL":[],
        "NETWORK":[],
        "RPC":[]
      },
      preset: undefined,
      settings,
      defaults: generateDefaults(data),
      modal
    };
  }
  handleChange = (settings) => {
    saveSettings(settings);
    this.setState({
      preset: undefined,
      settings
    });
  };
  handlePreset = (preset, settings) => {
    saveSettings(settings);
    this.setState({
      preset,
      settings
    });
  };
  handleError = (error) => {
    this.setState({
      modal: {
        visible: true,
        title: 'Error',
        content: (
          <p>{error}</p>
        )
      }
    });
  };
  render () {
    const {display_sections, settings, defaults, preset, modal} = this.state;
    return (
      <div className='mdl-layout mdl-js-layout mdl-layout--fixed-header'>
        
        <main className='mdl-layout__content'>
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--8-col mdl-cell--12-col-tablet'>
              <Editor settings={settings} display_sections={display_sections} onChange={this.handleChange} />
            </div>
            <div className='mdl-cell mdl-cell--4-col mdl-cell--12-col-tablet'>
              
            </div>
          </div>
        </main>
        
      </div>
    );
  }
}
function generateDefaults (settings) {
  const defaults = Object.keys(settings).reduce((data, section) => {
    data[section] = Object.keys(settings[section])
    .filter(key => settings[section][key].default !== undefined)
    .reduce((d, key) => {
      d[key] = settings[section][key].default;
      return d;
    }, {});
    return data;
  }, {});
  defaults.__internal.platform = detectPlatform();
  return defaults;
}
export default App;