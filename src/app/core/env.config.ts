const _isLocalhost = window.location.port.indexOf('4200') > -1;

const getHostApi = () => {
  if (_isLocalhost) { return 'http://localhost:8080/api'; }
  else {
    return 'https://team-srh.herokuapp.com/api';
  }
};

const getHostApi1 = () => {
  if (_isLocalhost) { return 'http://localhost:8080/api2'; }
  else {
    return 'https://team-srh.herokuapp.com/api';
  }
};

const getHostApi2 = () => {
  if (_isLocalhost) { return 'http://localhost:8080/api/v1'; }
  else {
    return 'https://team-srh.herokuapp.com/api';
  }
};
const getHostApi3 = () => {
  if (_isLocalhost) { return 'http://localhost:8080/api/v2'; }
  else {
    return 'https://team-srh.herokuapp.com/api';
  }
};

export const ENV = {
  API_HOST_URL: getHostApi(),
  API_HOST_1_URL: getHostApi1(),
  API_HOST_2_URL: getHostApi2(),
  API_HOST_3_URL: getHostApi3()
};
