export interface TokenGenerator {
  generate (userId: string): Promise<string>
}
