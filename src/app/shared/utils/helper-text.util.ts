export const helperText = (payload: {
  error: string;
  params?: string;
}): string => {
  const { error, params } = payload;
  switch (error) {
    case 'required':
      return '* This field is required';
    case 'minlength':
      return `* This field must be at least ${params} characters`;
    case 'maxlength':
      return `* This field must be less than ${params} characters`;
    case 'alpha_spaces':
      return '* This field must contain only letters and spaces';
    default:
      return '';
  }
};
