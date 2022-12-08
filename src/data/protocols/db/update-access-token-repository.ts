export interface UpdateAccessTokenRepository {
  updateAccessToken (userId: string, token: string): Promise<void>
}
