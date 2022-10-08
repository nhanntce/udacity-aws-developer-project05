import { apiEndpoint } from '../config'
import Axios from 'axios'
import { Course } from '../types/Course'
import { CreateCourseRequest } from '../types/CreateCourseRequest'
import { UpdateCourseRequest } from '../types/UpdateCourseRequest'

export async function getCourses(idToken: string): Promise<Course[]> {
  console.log('Fetching courses')

  const response = await Axios.get(`${apiEndpoint}/courses`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Courses:', response.data)
  return response.data.items
}

export async function createCourse(
  idToken: string,
  newCourse: CreateCourseRequest
): Promise<Course> {
  const response = await Axios.post(
    `${apiEndpoint}/courses`,
    JSON.stringify(newCourse),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.item
}

export async function patchCourse(
  idToken: string,
  courseId: string,
  updatedCourse: UpdateCourseRequest
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/courses/${courseId}`,
    JSON.stringify(updatedCourse),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function deleteCourse(
  idToken: string,
  courseId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/courses/${courseId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  courseId: string
): Promise<string> {
  const response = await Axios.post(
    `${apiEndpoint}/courses/${courseId}/attachment`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.uploadUrl
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file)
}

export async function updateAttachmentUrl(
  idToken: string,
  courseId: string
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/courses/${courseId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
}
