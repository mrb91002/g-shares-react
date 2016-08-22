import Paper from 'material-ui/Paper';
import AssignmentReturned
  from 'material-ui/svg-icons/action/assignment-returned';
import Cancel from 'material-ui/svg-icons/navigation/cancel';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import TextField from 'material-ui/TextField';
import Joi from 'joi'

const schema = Joi.object({
  title: Joi.string().trim().max(255),
  topic: Joi.string().trim().max(50),
  url: Joi.string().trim().uri({ scheme: /^https?/ })
});


const PostForm = React.createClass({
  getInitialState() {
    return {
      errors: {},
      post: this.props.post
    };
  },

  handleBlur(event) {
    const { name, value } = event.target;
    const nextErrors = Object.assign({}, this.state.errors);
    const result = Joi.validate({ [name]: value }, schema);

    // result.error => {} or null
    // result.value => "converted" user input
    if (result.error) {
      // invalid
      for (const detail of result.error.details) {
        nextErrors[detail.path] = detail.message;
      }

      return this.setState({ errors: nextErrors });
    }

    delete nextErrors[name];

    this.setState({ errors: nextErrors })
    //valid
  },

  handleChange(event) {
    // event.target.value
    // this.state.post needs to change
    const nextPost = Object.assign({}, this.state.post, {
      [event.target.name]: event.target.value
    })

    this.setState({ post: nextPost});
  },

  handleTouchTapSave() {
    const result = Joi.validate(this.state.post, schema, {
      abortEarly: false,
      allowUnknown: true
    });

    if (result.error) {
      const nextErrors = {}

      for (const detail of result.error.details) {
        nextErrors[detail.path] = detail.message;
      }

      return this.setState({ errors: nextErrors });
    }

    const nextPost = Object.assign({}, result.value, { votes: 1 });

    this.props.updatePost(this.props.post, nextPost);
  },

  handleTouchTapCancel() {
    this.props.stopEditingPost(this.props.post);
  },

  render() {

    const { errors, post } = this.state;

    const styleRaisedButton = {
      marginRight: '10px',
      marginTop: '40px'
    };

    const styleTextField = {
        display: 'block'
    };

    return <Paper className="paper">
      <h3>PostForm</h3>

      <TextField
        errorText={errors.url}
        floatingLabelText="url"
        fullWidth={true}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        style={styleTextField}
        name="url"
        value={post.url}
      />

      <TextField
        errorText={errors.title}
        onBlur={this.handleBlur}
        style={styleTextField}

        floatingLabelText="title"
        fullWidth={true}
        onChange={this.handleChange}
        name="title"
        value={post.title}
      />

      <TextField
        errorText={errors.topic}
        onBlur={this.handleBlur}

        style={styleTextField}
        floatingLabelText="topic"
        onChange={this.handleChange}
        name="topic"
        fullWidth={true}
        value={post.topic}
      />

      <RaisedButton
        style={styleRaisedButton}
        icon={<Cancel />}
        label="Cancel"
        primary={true}
        onTouchTap={this.handleTouchTapCancel}
      />

      <RaisedButton
        icon={<AssignmentReturned />}
        label="Save"
        onTouchTap={this.handleTouchTapSave}
        primary={true}
        style={styleRaisedButton}
      />


    </Paper>;
  }
});

export default PostForm;
