import { supabase } from '../supabase-client';
import { Profile } from '../util/types/database';
import { api } from './api';
import { processSupabaseData } from './service-utils';

const profileService = api.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<Profile, { profileId: string }>({
      queryFn: async ({ profileId }) => {
        const data = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .limit(1)
          .then(processSupabaseData);
        return { data };
      },
    }),
  }),
});

export const { useLazyGetProfileQuery } = profileService;
