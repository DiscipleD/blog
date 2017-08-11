interface GraphQLResponseError {
  message: string
}

interface GraphQLResponse<T> {
  data?: T,
  error?: GraphQLResponseError[]
}
