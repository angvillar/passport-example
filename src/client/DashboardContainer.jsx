
/* eslint-disable react/prop-types */

import React from 'react';
import Dashboard from './Dashboard';

class DashboardContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = { user: {} };
  }

  componentDidMount() {
    const uri = `/${this.props.params.username}`;
    console.log('fetching: ', uri);
    fetch(uri, {
      method: 'get',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
      },
    })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((json) => {
      console.log(json);
      this.setState({ user: json.user });
    })
    .catch(console.log);
  }

  render() {
    return (
      <Dashboard user={this.state.user} />
    );
  }

}

/*
DashboardContainer.propTypes = {
  params: {
    username: React.PropTypes.string,
  },
};
*/

export default DashboardContainer;
