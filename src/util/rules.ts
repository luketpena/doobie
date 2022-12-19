export const rules = {
  required: (message = 'Required') => {
    return { value: true, message };
  },
  pattern: {
    email: (message = 'Email must be valid') => {
      return {
        value:
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message,
      };
    },
    phone: (message = 'Phone number must be valid') => {
      return {
        value: /^[0-9]{10}$/g,
        message,
      };
    },
  },
};
