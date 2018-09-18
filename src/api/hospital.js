import api from '@/utils/api'

export function getAllHospitals() {
  return api({
    url: 'http://127.0.0.1:8091/hospital/all',
    method: 'get',
    params: {
    }
  })
}

export function addHospital(hospital) {
  return api({
    url: 'http://127.0.0.1:8091/hospital/',
    method: 'post',
    data: {
      'platform': 'Web',
      'version': 'v1',
      'hospitalId': hospital.hospitalId,
      'cityId': hospital.cityId,
      'name': hospital.name
    }
  })
}

export function updateHospital(hospital) {
  return api({
    url: 'http://127.0.0.1:8091/hospital/' + hospital.hospitalId,
    method: 'put',
    data: {
      'platform': 'Web',
      'version': 'v1',
      'hospitalId': hospital.hospitalId,
      'cityId': hospital.cityId,
      'name': hospital.name
    }
  })
}

export function deleteHospital(hospitalId) {
  return api({
    url: 'http://127.0.0.1:8091/hospital/' + hospitalId,
    method: 'delete',
    params: {
    }
  })
}
