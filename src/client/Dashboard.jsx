/* eslint-disable react/prop-types */
import React from 'react';
import { withRouter } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  logout() {
    fetch('/logout', {
      method: 'get',
      credentials: 'same-origin',
    })
    .then((res) => {
      console.log(res);
      this.props.router.push('/sign-in');
    })
    .catch(console.log);
  }

  render() {
    return (
      <div>
        <h1>{this.props.user.username}</h1>
        <RaisedButton
          type="button"
          label="logout"
          onClick={this.logout}
          primary
        />
      </div>
    );
  }
}

/*
Dashboard.propTypes = {
  user: {
    username: React.PropTypes.string,
  },
};
*/

export default withRouter(Dashboard);
