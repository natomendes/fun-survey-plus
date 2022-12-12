export class EmailInUseError extends Error {
  constructor () {
    super('The email is already in use')
    this.name = 'EmailInUseError'
  }
}
