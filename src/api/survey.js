import api from '@/utils/api'

export function getAllSurveyTypes() {
  return api({
    url: 'http://127.0.0.1:8091/surveyType/all',
    method: 'get',
    params: {
    }
  })
}

export function getSurveyInfos(listQuery) {
  return api({
    url: 'http://127.0.0.1:8091/survey/',
    method: 'get',
    params: {
      'page': listQuery.pageNum - 1,
      'size': listQuery.pageRow
    }
  })
}

export function addSurvey(survey) {
  return api({
    url: 'http://127.0.0.1:8091/survey/',
    method: 'post',
    data: {
      'platform': 'Web',
      'version': 'v1',
      'pkSurvey': survey.pkSurvey,
      'pkSurveyType': survey.pkSurveyType,
      'surveyName': survey.surveyName,
      'department': survey.department,
      'description': survey.description,
      'sendOnRegister': survey.sendOnRegister,
      'frequency': survey.frequency
    }
  })
}

export function updateSurvey(survey) {
  return api({
    url: 'http://127.0.0.1:8091/survey/' + survey.pkSurvey,
    method: 'put',
    data: {
      'platform': 'Web',
      'version': 'v1',
      'pkSurvey': survey.pkSurvey,
      'pkSurveyType': survey.pkSurveyType,
      'surveyName': survey.surveyName,
      'department': survey.department,
      'description': survey.description,
      'sendOnRegister': survey.sendOnRegister,
      'frequency': survey.frequency
    }
  })
}

export function deleteSurvey(surveyId) {
  return api({
    url: 'http://127.0.0.1:8091/survey/' + surveyId,
    method: 'delete',
    params: {
    }
  })
}
