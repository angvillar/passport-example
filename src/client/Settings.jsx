/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react/prop-types */

import React from 'react';
import { Link } from 'react-router';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';

const Settings = props => (
  <div>
    <Menu>
      <Subheader>Personal</Subheader>
      <MenuItem
        linkButton
        containerElement={<Link to="/settings/profile" />}
        primaryText="Profile"
      />
      <MenuItem
        linkButton
        containerElement={<Link to="/settings/account" />}
        primaryText="Account"
      />
    </Menu>
    {props.children}
  </div>
);

export default Settings;
