import axios from '@/config/axiosConfig.ts';
import { API_SERVER } from '@/constants/domain.ts';
import { getCookie, getBearerToken } from '@/utils/cookies.ts';
import { CitizenCard } from '@/models/newModel/citizenCard.ts';

export const fetchCitizenCardById = async (id: number) => {
  return await axios.get<CitizenCard>(API_SERVER + '/kyc/' + id, {
    headers: {
      'Content-Type': 'application/json',

      Authorization: getBearerToken(),
    },
  });
};
