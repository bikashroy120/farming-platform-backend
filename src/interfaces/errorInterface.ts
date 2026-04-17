export interface IGenericErrorMessage {
  path: string;
  message: string;
}

export interface IGenericErrorResponse {
  status: boolean;
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
}
