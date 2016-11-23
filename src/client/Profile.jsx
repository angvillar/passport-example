import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import _ from 'lodash';
import isLength from 'validator/lib/isLength';

class Profile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: { value: '', error: '' },
      bio: { value: '', error: '' },
    };

    this.nameHandleChange = this.nameHandleChange.bind(this);
    this.bioHandleChange = this.bioHandleChange.bind(this);
    this.submitHandle = this.submitHandle.bind(this);
  }

  nameHandleChange(event) {
    const newName = _.extend({}, this.state.name);
    newName.value = event.target.value;
    newName.error = isLength(event.target.value, { min: 0, max: 20 }) ? '' : 'too long';
    this.setState({ name: newName });
  }

  bioHandleChange(event) {
    const newBio = _.extend({}, this.state.bio);
    newBio.value = event.target.value;
    newBio.error = isLength(event.target.value, { min: 0, max: 120 }) ? '' : 'too long';
    this.setState({ bio: newBio });
  }

  submitHandle(event) {
    event.preventDefault();

    const data = {
      name: this.state.name.value,
      bio: this.state.bio.value,
    };

    // const formData = new FormData();
    // formData.append("data", JSON.stringify(data)); // eslint-disable-line quotes

    fetch('/settings/profile', {
      method: 'post',
      credentials: 'same-origin',
      body: JSON.stringify(data),
      /*
      body: {
        name: JSON.stringify(this.state.name.value),
        bio: JSON.stringify(this.state.bio.value),
      },
      */
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((json) => {
      console.log(json);
    })
    .catch(console.log);
  }

  render() {
    return (
      <form onSubmit={this.submitHandle}>
        <TextField
          type="text"
          hintText="Name"
          floatingLabelText="Name"
          errorText={this.state.name.error}
          value={this.state.name.value}
          onChange={this.nameHandleChange}
        />
        <br />
        <TextField
          hintText="Tell about you"
          floatingLabelText="Bio"
          errorText={this.state.bio.error}
          value={this.state.bio.value}
          onChange={this.bioHandleChange}
          multiLine
          rows={4}
        />
        <br />
        <RaisedButton
          type="submit"
          label="Update profile"
          primary
        />
      </form>
    );
  }

}

export default Profile;
