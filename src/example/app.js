// import '../lib/react-ui-tree.css';
import SimpleTable from './SimpleTable'
import ReactDOM from 'react-dom';
import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <SimpleTable/>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('app'));
