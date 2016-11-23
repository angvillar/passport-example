/* eslint-disable react/prop-types */
import React from 'react';

function Dashboard(props) {
  return (
    <div>
      <h1>{props.user.username}</h1>
    </div>
  );
}

/*
Dashboard.propTypes = {
  user: {
    username: React.PropTypes.string,
  },
};
*/

export default Dashboard;
