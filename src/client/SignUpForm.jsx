import React from 'react';
import { withRouter, Link } from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import _ from 'lodash';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';

class SignUpForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: { value: '', error: '' },
      username: { value: '', error: '' },
      password: { value: '', error: '' },
    };

    this.usernameHandleChange = this.usernameHandleChange.bind(this);
    this.usernameHandleBlur = this.usernameHandleBlur.bind(this);

    this.emailHandleChange = this.emailHandleChange.bind(this);
    this.emailHandleBlur = this.emailHandleBlur.bind(this);

    this.passwordHandleChange = this.passwordHandleChange.bind(this);
    this.passwordHandleBlur = this.passwordHandleBlur.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  usernameHandleChange(event) {
    const newUsername = _.extend({}, this.state.username);
    newUsername.value = event.target.value;
    this.setState({ username: newUsername });
  }

  usernameHandleBlur() {
    const newUsername = _.extend({}, this.state.username);
    newUsername.error = isLength(this.state.username.value, { min: 6, max: 20 }) ? '' : 'Invalid';
    this.setState({ username: newUsername });
  }

  emailHandleChange(event) {
    const newEmail = _.extend({}, this.state.email);
    newEmail.value = event.target.value;
    this.setState({ email: newEmail });
  }

  emailHandleBlur() {
    const newEmail = _.extend({}, this.state.email);
    newEmail.error = isEmail(this.state.email.value) ? '' : 'Invalid';
    this.setState({ email: newEmail });
  }

  passwordHandleChange(event) {
    const newPassword = _.extend({}, this.state.password);
    newPassword.value = event.target.value;
    this.setState({ password: newPassword });
  }

  passwordHandleBlur() {
    const newPassword = _.extend({}, this.state.password);
    newPassword.error = isLength(this.state.password.value, { min: 6, max: 20 }) ? '' : 'Invalid';
    this.setState({ password: newPassword });
  }

  handleSubmit(event) {
    event.preventDefault();

    const details = {
      email: this.state.email.value,
      password: this.state.password.value,
    };

    let formBody = [];
    for (const property in details) { // eslint-disable-line no-restricted-syntax, guard-for-in
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(details[property]);
      // formBody.push(encodedKey + "=" + encodedValue);
      formBody.push(`${encodedKey}=${encodedValue}`);
    }
    formBody = formBody.join('&');
    console.log(formBody);

    fetch('/signup', {
      method: 'post',
      credentials: 'same-origin',
      body: formBody,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((json) => {
      if (json.message.length) {
        const newEmail = _.extend({}, this.state.email);
        newEmail.error = json.message[0];
        this.setState({ email: newEmail });
      } else {
        this.props.router.push('/settings');
      }
    })
    .catch(console.log);
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <TextField
            type="text"
            hintText="Username"
            floatingLabelText="Username"
            errorText={this.state.username.error}
            value={this.state.username.value}
            onChange={this.usernameHandleChange}
            onBlur={this.usernameHandleBlur}
          />
          <br />
          <TextField
            type="text"
            hintText="Email"
            floatingLabelText="Email"
            errorText={this.state.email.error}
            value={this.state.email.value}
            onChange={this.emailHandleChange}
            onBlur={this.emailHandleBlur}
          />
          <br />
          <TextField
            type="password"
            hintText="Password"
            floatingLabelText="Password"
            errorText={this.state.password.error}
            value={this.state.password.value}
            onChange={this.passwordHandleChange}
            onBlur={this.passwordHandleBlur}
          />
          <br />
          <RaisedButton
            type="submit"
            label="Submit"
            primary
          />
        </form>
        <p>Already have an account, <Link to="/sign-in">Sign in</Link></p>
      </div>
    );
  }

}

SignUpForm.propTypes = {
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(SignUpForm);
