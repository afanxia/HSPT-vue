import api from '@/utils/api'

export function getAllSurveyTypes() {
  return api({
    url: 'http://127.0.0.1:8091/surveyType/all',
    method: 'get',
    params: {
    }
  })
}

export function addSurveyType(surveyType) {
  return api({
    url: 'http://127.0.0.1:8091/surveyType/',
    method: 'post',
    data: {
      'platform': 'Web',
      'version': 'v1',
      'pkSurveyType': surveyType.pkSurveyType,
      'surveyTypeName': surveyType.surveyTypeName
    }
  })
}

export function updateSurveyType(surveyType) {
  return api({
    url: 'http://127.0.0.1:8091/surveyType/' + surveyType.pkSurveyType,
    method: 'put',
    data: {
      'platform': 'Web',
      'version': 'v1',
      'pkSurveyType': surveyType.pkSurveyType,
      'surveyTypeName': surveyType.surveyTypeName
    }
  })
}

export function deleteSurveyType(surveyTypeId) {
  return api({
    url: 'http://127.0.0.1:8091/surveyType/' + surveyTypeId,
    method: 'delete',
    params: {
    }
  })
}
