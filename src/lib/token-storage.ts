const TOKEN_KEY = '@time-ledger:token'

export class TokenStorage {
  static save(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  }

  static get(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }

  static remove(): void {
    localStorage.removeItem(TOKEN_KEY)
  }

  static exists(): boolean {
    return !!localStorage.getItem(TOKEN_KEY)
  }
}
