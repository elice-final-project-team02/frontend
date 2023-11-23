import axios from 'axios';
import { useMutation } from 'react-query';

const postSendMail = async (email) => {
  const response = await axios.post('http://localhost:5001/api/user/register/send-mail', { email: email });
  return response.data;
};

export function usePostSendMail(email) {
  return useMutation(() => postSendMail(email), {
    onSuccess: (response) => {
      alert(response.message);
    },
    onError: (error) => {
      if (error.response) {
        const errorCode = error.response.status;
        const errorMessage = error.response.data.message;

        if (errorCode === 400) {
          alert(errorMessage);
        } else if (errorCode === 404) {
          alert(errorMessage);
        } else {
          alert('서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
      } else if (error.request) {
        alert('요청을 보내는 중에 문제가 발생했습니다. 네트워크 연결을 확인해주세요.');
      } else {
        alert('요청을 처리하는 중에 문제가 발생했습니다.');
      }
    },
  });
}