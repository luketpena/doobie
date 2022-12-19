import { format, parse } from 'date-fns';

export function handleSupabaseError(result: any) {
  if (result.error) {
    console.error('SUPABASE ERROR');
    console.log(result.error);
    throw new Error(result.error);
  }
  return result;
}

export function processSupabaseData(result: any, array = false) {
  handleSupabaseError(result);
  return array ? result.data : result.data[0];
}

export function processSupabaseDataArray(result: any) {
  return processSupabaseData(result, true);
}

// Returns a date string formatted for Supabase using with Date or string
// If no date is provided, defaults to today
export function getDbDate(date?: Date | string) {
  return format(date ? new Date(date) : new Date(), 'yyyy-MM-dd');
}

export function translateDbDate(date: string) {
  return parse(date, 'yyyy-MM-dd', new Date());
}
