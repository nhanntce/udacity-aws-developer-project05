import { History } from 'history'
import * as React from 'react'
import update from 'immutability-helper'
import {
  Button,
  Checkbox,
  Divider,
  Table,
  Header,
  Grid,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { deleteCourse, getCourses, patchCourse } from '../api/courses-api'
import Auth from '../auth/Auth'
import { Course } from '../types/Course'

interface CoursesProps {
  auth: Auth
  history: History
}

interface CoursesState {
  courses: Course[]
  loadingCourses: boolean
}

const Progress: string[] = ['Open', 'In-progress', 'Done']


export class Todos extends React.PureComponent<CoursesProps, CoursesState> {
  state: CoursesState = {
    courses: [],
    loadingCourses: true
  }

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/courses/${todoId}/edit`)
  }

  onCreateButtonClick = () => {
    this.props.history.push(`/create-course`)
  }

  onCourseDelete = async (courseId: string) => {
    try {
      await deleteCourse(this.props.auth.getIdToken(), courseId)
      this.setState({
        courses: this.state.courses.filter(
          (course) => course.courseId !== courseId
        )
      })
    } catch {
      alert('Course deletion failed')
    }
  }

  onChangeProgress = async (pos: number) => {
    try {
      const course = this.state.courses[pos]
      let progress = course.progress
      if (progress === 2) {
        progress = -1
      }
      progress++
      await patchCourse(this.props.auth.getIdToken(), course.courseId, {
        name: course.name,
        cost: course.cost,
        duration: course.duration,
        progress: progress
      })

      this.setState({
        courses: update(this.state.courses, {
          [pos]: { progress: { $set: progress } }
        })
      })
    } catch {
      alert('Change progress failed')
    }
  }

  async componentDidMount() {
    try {
      const courses = await getCourses(this.props.auth.getIdToken())
      this.setState({
        courses,
        loadingCourses: false
      })
    } catch (e) {
      alert(`Failed to fetch courses: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Course List</Header>
        <hr />

        {this.renderTodos()}
      </div>
    )
  }

  renderTodos() {
    if (this.state.loadingCourses) {
      return this.renderLoading()
    }

    return this.renderCoursesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Courses
        </Loader>
      </Grid.Row>
    )
  }

  renderCoursesList() {
    return this.state.courses.length === 0 ? (
      <div>
        <h2>There is no course available.</h2>
        <Button icon color="blue" onClick={() => this.onCreateButtonClick()}>
          Create new course
        </Button>
      </div>
    ) : (
      <Table celled padded>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell singleLine>Image</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Cost ($)</Table.HeaderCell>
            <Table.HeaderCell>Duration (hours)</Table.HeaderCell>
            <Table.HeaderCell>Progress</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.state.courses.map((course, pos) => {
            return (
              <Table.Row key={course.courseId}>
                <Table.Cell>
                  {course.attachmentUrl ? (
                    <Image src={course.attachmentUrl} size="small" />
                  ) : (
                    <Image src="/No_image_available.svg.png" size="small" />
                  )}
                </Table.Cell>
                <Table.Cell singleLine>{course.name}</Table.Cell>
                <Table.Cell textAlign="right">{course.cost}</Table.Cell>
                <Table.Cell textAlign="right">{course.duration}</Table.Cell>
                <Table.Cell textAlign="center">
                  {this.getProgress(course, pos)}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    icon
                    color="blue"
                    onClick={() => this.onEditButtonClick(course.courseId)}
                  >
                    <Icon name="pencil" />
                  </Button>
                  <Button
                    icon
                    color="red"
                    onClick={() => this.onCourseDelete(course.courseId)}
                  >
                    <Icon name="delete" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    )
  }

  getProgress(course: Course, pos: number) {
    let button = <Button color="grey" onClick={() => this.onChangeProgress(pos)}>{Progress[course.progress]}</Button>
    if (course.progress === 1) {
      button = <Button color="yellow" onClick={() => this.onChangeProgress(pos)}>{Progress[course.progress]}</Button>
    }
    if (course.progress === 2) {
      button = <Button color="green" onClick={() => this.onChangeProgress(pos)}>{Progress[course.progress]}</Button>
    }

    return button
  }
}
