import React, { Component } from 'react';
import { Form, Container, Segment, Header, Button} from 'semantic-ui-react';
import Navbar from "../../Common/navbar";
import { Redirect } from 'react-router-dom';
import './createProject.css';
import techSelection from '../../../utils/techTags.json';
import axios from 'axios';




const languageOptions = [
  {
    text: 'Javascript', value: 'javascript'
  },
  {
    text: 'HTML', value: 'html'
  },
  {
    text: 'CSS', value: 'css'
  },
  {
    text: 'Node.js', value: 'node'
  },
  {
    text: 'Express', value: 'express'
  },
  {
    text: 'HTML', value: 'html'
  },
  {
    text: 'CSS', value: 'css'
  },
  {
    text: 'AJAX/API', value: 'ajax' || 'api',
  },
  {
    text: 'Other', value: 'other'
  },
  {
    text: 'Review Session', value: 'reviewSession'
  },
  {
    text: 'Java', value: 'java'
  },
  {
    text: 'React', value: 'react'
  },
  {
    text: 'mySQL', value: 'mysql'
  },
  {
    text: 'MongoDB', value: 'mongodb'
  }
]

const fileTypeOptions = [
  {
    text: 'pdf',
    value: 'pdf'
  },
  {
    text: 'article',
    value: 'article'
  },
  {
    text: 'video',
    value: 'video'
  }
]

const statusOptions = [
  {
    text: 'recommended',
    value: 'recommended'
  },
  {
    text: 'required',
    value: 'required'
  },
  {
    text: 'active',
    value: 'active'
  },
  {
    text: 'disabled',
    value: 'disabled'
  }
]

class CreateProjectForm extends Component {
  state = {
    mode: 'create',
    project: {
      fileType: '',
      name: '',
      title: '',
      description: '',
      language: '',
      tech_tags: [],
      likes: 0,
      dislikes: 0,
      img: '',
      s3_url: '',
      other_url: '',
      video_url: '',
      status: ['active']
    },
    userID: this.props.auth,
    redirect: false,
    redirect_location: ''
  };

  // Also, get info on the user and save to this.state.userID
  componentDidMount() {
    if (this.determineMode(...this.getParams())) {
      this.fetchProjectData(...this.getParams())
      .then(() => {
        if (this.state.userID.user.github.login !== this.state.owner_id.github.login) {
          const [cohort, username, project] = this.getParams();
          this.setState({redirect_location: `/${cohort}/${username}/app/${project}` })
          this.setState({redirect: true })
        }
      })
    }    
  }

  getParams = () => [this.props.match.params.cohort, this.props.match.params.username, this.props.match.params.project];

  determineMode = (cohort, username, project) => {
    if (cohort && username && project) {
      // console.log('edit mode!')
      this.setState({mode: 'edit'})
      return true;
    } else {
      return false;
    }
  }

  fetchProjectData = (cohort, username, project) => {
    return axios.get(`/api/projectData/${cohort}/${username}/app/${project}`).then(res => {
      // console.log('Project data:',res.data);
      const p = res.data[0];
      this.setState({ 
        project:{
          _id: p._id,
          fileType: p.fileType,
          name: p.name,
          title: p.title,
          description: p.description,
          language: p.language,
          tech_tags: p.tech_tags,
          likes: p.likes,
          dislikes: p.dislikes,
          img: p.img,
          s3_url: p.s3_url,
          other_url: p.other_url,
          video_url: p.video_url,
          admin_id: this.state.userID,
          status: this.state.status
        }
      });
      this.setState({owner_id: p.owner_id})
      return res.data[0].owner_id;
    }).catch(error => {
      console.log('Error while fetching data:', error);
      return error;
    });
  }

  handleMainTechnologyChange = (e, {value}) => {
    this.setState({
      project: {
        ...this.state.project,
        language: value
      }
    });
  }

  handleOtherTechnologiesChange = (e, {value}) => {
    this.setState({
      project: { 
        ...this.state.project,
        tech_tags: value 
      }
    });
  }

  handleTitleChange = (e, {value}) => {
    this.setState({
      project: {
        ...this.state.project,
        title: value 
      }
    });
  }

  handleFileTypeChange = (e, {value}) => {
    this.setState({ 
      project: {
        ...this.state.project,
        fileType: value
      }
    });
  }

  handleStatusChange = (e, {value}) => {
    this.setState({ 
      project: {
        ...this.state.status,
        status: value
      }
    });
  }

  handleInputChange = event => {
    this.setState({ 
      project: {
        ...this.state.project,
        [event.target.name]: event.target.value
      }
    });
  }

  handleSubmitButton = event => {
    event.preventDefault();
    const regex = /^[a-zA-Z0-9-_ ]+$/;
    const warning = document.querySelector('.warning');
    const asterisk = document.getElementsByClassName('asterisk');
    warning.style.display = 'none';
    if (this.state.project.name.search(regex) === -1) {
      warning.innerHTML = '*Project title may only contain letters, numbers, dashes, and underscores';
      warning.style.display = 'block';
    }
    else if (this.state.mode === 'create') {
        axios.post('/api/projectNew', this.state.project)
        .then(res => {
          // console.log(res.data);
          this.setState({redirect_location: `/${this.props.match.params.cohort}/${this.state.userID.user.github.login}/app/${this.state.project.title}`})
          this.setState({redirect: true })
        }).catch(err => console.log(err));
      } else {
        console.log("in else statement for editing of project");
        axios.patch('/api/projects', {
          projectId: this.state.project._id,
          update: this.state.project
        })
        .then(res => {
          this.setState({redirect_location: `/${this.props.match.params.cohort}/${this.state.userID.user.github.login}/app/${this.state.project.title}`})
          this.setState({redirect: true })
        }).catch(err => console.log(err));
      }
    }
  

  render(props) {
    // console.log("this is state before the render:", this.state);
    if (this.state.redirect) {
      return (<Redirect to={this.state.redirect_location} />)
    } else {
      return (
        <div className='createBackground'>
          <Navbar currentPage='create' cohort={this.props.match.params.cohort} username={this.state.userID.user.github.login} avatar={this.state.userID.user.github.avatar_url}/>
          <Segment basic textAlign='center' vertical className='createBanner'>
            <Container>
              <Header className='createHeader'>
                {this.state.mode === 'create' ? 
                'Create a Project' :
                `Edit ${this.state.project.title}`}
              </Header>
            </Container>
          </Segment>
          <Container className='createContainer' text>
            <Segment>
            <Form size='large' class='form' onSubmit={this.handleSubmitButton}>
              {this.state.mode === 'edit' ? 
              <Form.Select name='status' multiple label='Status' options={statusOptions} 
                onChange={this.handleStatusChange} value={this.state.project.status}/> : ''}
              <Form.Select name='fileType' search label='Resource Type' options={fileTypeOptions}
                onChange={this.handleFileTypeChange} required value={this.state.project.fileType}/>
              <Form.Input name='title' label='Resource Title' 
                onChange={this.handleInputChange} required value={this.state.project.title}/>
               <Form.Input name='name' label='File Name (no spaces)' 
                onChange={this.handleInputChange} required value={this.state.project.name}/>
              <Form.Input name='img' label='Resource Image'placeholder='Resource Image Link/URL' 
                onChange={this.handleInputChange} type='url' value={this.state.project.img}/>
              <Form.TextArea name='description' label='Resource Description' placeholder='Describe the Resource and what it offers.' 
                onChange={this.handleInputChange} max='250' required value={this.state.project.description}/>
              <Form.Select name='language' search label='Primary Language' options={languageOptions}
                onChange={this.handleMainTechnologyChange} required value={this.state.project.language}/>
              <Form.Select name='tech_tags' multiple search label='Other Technologies' options={techSelection} 
                onChange={this.handleOtherTechnologiesChange} value={this.state.project.tech_tags}/>
              <Form.Input name='s3_url' type="url" label='PDF S3 URL' 
                onChange={this.handleInputChange} value={this.state.project.s3_url}/>
              <Form.Input name='other_url' type="url" label='Article URL' 
                onChange={this.handleInputChange} value={this.state.project.other_url}/>
              <Form.Input name='video_url' type="url" label='Video URL' 
                onChange={this.handleInputChange} value={this.state.project.video_url}/>
              <Button className='createButton'>
              {this.state.mode === 'create' ? 
              'Create Project' :
              'Save Changes'}
              </Button>
            </Form>
            <p className='warning'></p>
            </Segment>
          </Container>
        </div>
      )
    }
  }
}

export default CreateProjectForm;