import { gql } from '@apollo/client'

// Mutations
export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      message
      status
      success
      token
      token_type
    }
  }
`

export const CREATE_SURVEY = gql`
  mutation createSurvey(
    $name: String!
    $status: String!
    $image_url: Upload
    $video_url: Upload
    $created_by: Float!
    $primary_question: SurveyQuestionInput!
    $option_a_question: [SurveyQuestionInput!]!
    $option_b_question: [SurveyQuestionInput!]!
    $survey_questions: [SurveyQuestionInput!]!
  ) {
    createSurvey(
      createSurveyData: {
        name: $name
        status: $status
        image_url: $image_url
        video_url: $video_url
        created_by: $created_by
        primary_question: $primary_question
        option_a_question: $option_a_question
        option_b_question: $option_b_question
        survey_questions: $survey_questions
      }
    ) {
      id
      name
      status
      image_url
      video_url
      created_by
      created_at
    }
  }
`

export const UPDATE_USER_DETAILS = gql`
  mutation UpdateUser($updateUserData: UpdateUserInput!) {
    updateUser(updateUserData: $updateUserData) {
      id
      first_name
      last_name
      email
      password
      status
      role_id
      is_deleted
      login_with
      created_at
    }
  }
`

export const CHANGE_PASSWORD = gql`
  mutation Changepasssword($changePasswordInput: ChangePasswordInput!) {
    changepasssword(changePasswordInput: $changePasswordInput) {
      message
      status
      success
      token
      token_type
      login_with
    }
  }
`

export const ADD_SURVEY_QUESTIONS = gql`
  mutation AddSurveyQuestions($addSurveyQuestionsData: addSurveyQuestionsInput!) {
    addSurveyQuestions(addSurveyQuestionsData: $addSurveyQuestionsData) {
      id
      survey_id
      question
      options
      option_type
      option_range {
        min
        max
      }
      is_primary
      is_primary_a
      is_primary_b
      created_by
      created_at
    }
  }
`

export const UPDATE_SURVEY_QUESTIONS = gql`
  mutation UpdateSurveyQuestions($updateSurveyQuestionsData: updateSurveyQuestionsInput!) {
    updateSurveyQuestions(updateSurveyQuestionsData: $updateSurveyQuestionsData) {
      id
      survey_id
      question
      options
      option_type
      option_range {
        min
        max
      }
      is_primary
      is_primary_a
      is_primary_b
      created_by
      created_at
    }
  }
`

// export const UPDATE_SURVEY_DATA = gql`
//   mutation UpdateSurvey($updateSurveyData: updateSurveyInput!) {
//     updateSurvey(updateSurveyData: $updateSurveyData) {
//       name
//       status
//     }
//   }
// `

export const UPDATE_SURVEY_DATA = gql`
  mutation updateSurvey(
    $id: Float!
    $name: String!
    $status: String!
    $primary_question: SurveyQuestionInput!
    $created_by: Float!
    $image_url: Upload
    $video_url: Upload
  ) {
    updateSurvey(
      updateSurveyData: {
        id: $id
        name: $name
        status: $status
        image_url: $image_url
        video_url: $video_url
        primary_question: $primary_question
        created_by: $created_by
      }
    ) {
      id
      name
      status
      image_url
      video_url
      created_by
      created_at
    }
  }
`

// #################################### Query  ####################################################

export const GET_USER_DETAIL_BY_TOKEN = gql`
  query Query($loginToken: String!) {
    getUserDetailsByToken(login_token: $loginToken)
  }
`

export const GET_SURVEYS = gql`
  query GetSurveys(
    $page: Int!
    $limit: Int!
    $search: String
    $sortBy: String
    $sortOrder: String
    $filterBy: String
    $filterValue: String
  ) {
    getSurveys(
      page: $page
      limit: $limit
      search: $search
      sortBy: $sortBy
      sortOrder: $sortOrder
      filterBy: $filterBy
      filterValue: $filterValue
    ) {
      totalCount
      totalPages
      currentPage
      data
    }
  }
`

export const GET_USERS_LIST = gql`
  query GetUsers(
    $page: Int!
    $limit: Int!
    $search: String
    $sortBy: String
    $sortOrder: String
    $filterByRole: String
    $status: String
  ) {
    getUsers(
      page: $page
      limit: $limit
      search: $search
      sortBy: $sortBy
      sortOrder: $sortOrder
      filterByRole: $filterByRole
      status: $status
    ) {
      currentPage
      data
      totalCount
      totalPages
    }
  }
`

export const GET_SURVEYS_STATUS_COUNT = gql`
  query Query($search: String) {
    getSurveyStatusCount(search: $search)
  }
`

export const GET_USER_ROLE_COUNT = gql`
  query Query($search: String) {
    userRoleCounts(search: $search)
  }
`

export const GET_SURVEY_DETAILS_BY_ID = gql`
  query Query($getSurveyDetailsById: Int!) {
    getSurveyDetailsById(id: $getSurveyDetailsById)
  }
`

export const DELETE_SURVEY = gql`
  query DeleteSurvey($deleteSurveyId: Int!) {
    deleteSurvey(id: $deleteSurveyId) {
      message
      status
      success
      token
      token_type
      login_with
    }
  }
`

export const DELETE_USER = gql`
  query DeleteUser($deleteUserId: Int!) {
    deleteUser(id: $deleteUserId) {
      message
      status
      success
      token
      token_type
      login_with
    }
  }
`

export const DELETE_SURVEY_QUESTIONS = gql`
  query DeleteSurveyQuestions($ids: [Int!]!) {
    deleteSurveyQuestions(ids: $ids) {
      message
      status
      success
      token
      token_type
    }
  }
`

export const GET_USER_BY_ID = gql`
  query GetUserById($getUserById: Int!) {
    getUserById(id: $getUserById) {
      id
      first_name
      last_name
      email
      password
      status
      role_id
      is_deleted
      login_with
      created_at
      role {
        id
        role
      }
    }
  }
`
