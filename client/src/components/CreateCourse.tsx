import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { createCourse } from '../api/courses-api'
import { CreateCourseRequest } from '../types/CreateCourseRequest'

enum CreateState {
  NoCreate,
  CreatingCourse
}

interface CreateCourseProps {
  auth: Auth
}

interface CreateCourseState {
  name: string
  duration: number
  cost: number
  createState: CreateState
}

export class CreateCourse extends React.PureComponent<
    CreateCourseProps,
    CreateCourseState
> {
  state: CreateCourseState = {
    name: '',
    duration: 0,
    cost: 0,
    createState: CreateState.NoCreate
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    this.setState({
      ...this.state,
      [event.target.name]: value
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (this.state.name.trim() === '') {
        alert('Name of course should be entered')
        return
      }

      if (this.state.cost < 0) {
        alert('Cost of course must be greater than 0')
        return
      }

      if (this.state.duration < 0) {
        alert('Duration of course must be greater than 0')
        return
      }

      this.setUploadState(CreateState.CreatingCourse)

      const addCourseReq: CreateCourseRequest = {
        name: this.state.name,
        cost: parseFloat(this.state.cost + ''),
        duration: parseFloat(this.state.duration + '')
      }

      await createCourse(
        this.props.auth.getIdToken(),
        addCourseReq

      )

      alert('Add course was successfully!')
    } catch (e) {
      alert('Could not add course: ' + (e as Error).message)
    } finally {
      this.setUploadState(CreateState.NoCreate)
    }
  }

  setUploadState(createState: CreateState) {
    this.setState({
      createState
    })
  }

  render() {
    return (
      <div>
        <h1>Upload new image</h1>

        <Form 
          onSubmit={this.handleSubmit}
          loading={this.state.createState !== CreateState.NoCreate}>
          <Form.Field>
            <label>Course's name</label>
            <input 
                value={this.state.name}
                name="name"
                onChange={this.handleInputChange}
                type="text"
                placeholder="Enter course's name" />
          </Form.Field>
          <Form.Field>
            <label>Cost</label>
            <input
                value={this.state.cost} 
                name="cost"
                type="number"
                onChange={this.handleInputChange}
                placeholder="Enter course's cost" />
          </Form.Field>
          <Form.Field>
            <label>Duration</label>
            <input
                value={this.state.duration} 
                name="duration"
                type="number"
                onChange={this.handleInputChange}
                placeholder="Enter course's duration" />
          </Form.Field>
          

          <Button
          loading={this.state.createState !== CreateState.NoCreate}
          type="submit"
        >
          Create
        </Button>
        </Form>
      </div>
    )
  }

}
