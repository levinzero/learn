import React from 'react';
import './home.scss';

export default class Home extends React.PureComponent {
  constructor(props) {
    super(props);
   }
  render() {
    const html = <div className="homePage">Home Page</div>;
    return html;
  }
}