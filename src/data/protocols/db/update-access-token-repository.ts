export interface UpdateAccessTokenRepository {
  update (userId: string, token: string): Promise<void>
}
