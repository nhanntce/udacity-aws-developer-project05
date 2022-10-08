import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import {
  getUploadUrl,
  uploadFile,
  updateAttachmentUrl
} from '../api/courses-api'

enum UploadState {
  NoUpload,
  UploadingFile
}

interface EditTodoProps {
  match: {
    params: {
      courseId: string
    }
  }
  auth: Auth
}

interface EditCourseState {
  file: any
  uploadState: UploadState
}

export class EditCourse extends React.PureComponent<
  EditTodoProps,
  EditCourseState
> {
  state: EditCourseState = {
    file: undefined,
    uploadState: UploadState.NoUpload
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.UploadingFile)
      const uploadUrl = await getUploadUrl(
        this.props.auth.getIdToken(),
        this.props.match.params.courseId
      )

      await uploadFile(uploadUrl, this.state.file)

      await updateAttachmentUrl(
        this.props.auth.getIdToken(),
        this.props.match.params.courseId
      )

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + (e as Error).message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <h1>Upload new image</h1>

        <Form
          onSubmit={this.handleSubmit}
          loading={this.state.uploadState !== UploadState.NoUpload}
        >
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          <Button type="submit">Upload</Button>
        </Form>
      </div>
    )
  }
}
