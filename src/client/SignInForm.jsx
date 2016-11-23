import React from 'react';
import { withRouter } from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

class SignInForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '' };

    this.emailHandleChange = this.emailHandleChange.bind(this);
    this.passwordHandleChange = this.passwordHandleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  emailHandleChange(event) {
    this.setState({ email: event.target.value });
  }

  passwordHandleChange(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    // const formData = new FormData();
    // formData.append('email', this.state.email);
    // formData.append('password', this.state.password);
    // console.log('form data: ', formData.get('email'), formData.get('password'));
    // console.log(formData);
    // console.log(formData.getAll(formData));

    const details = {
      email: this.state.email,
      password: this.state.password,
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
    fetch('/login', {
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
      console.log(json);
      if (json.message.length) {
        this.setState({ error: json.message[0] });
      }
      // else redirect
    })
    .catch(console.log);
  }

  render() {
    return (
      <div>
        <p>{this.state.error}</p>
        <form onSubmit={this.handleSubmit}>
          <TextField
            type="text"
            hintText="Email"
            floatingLabelText="Email"
            value={this.state.email.value}
            onChange={this.emailHandleChange}
          />
          <br />
          <TextField
            type="password"
            hintText="Password"
            floatingLabelText="Password"
            value={this.state.password.value}
            onChange={this.passwordHandleChange}
          />
          <br />
          <RaisedButton
            type="submit"
            label="Sign in"
            primary
          />
        </form>
      </div>
    );
  }

}

SignInForm.propTypes = {
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(SignInForm);
