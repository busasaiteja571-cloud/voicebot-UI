// This file is required by Angular and will be used during build with `--configuration production`.

export const environment = {
  production: true,
  apiBaseUrl: process.env['API_BASE_URL'] || '/api'
};
