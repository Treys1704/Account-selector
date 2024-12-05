export interface Account {
    id: string
    type: 'checking' | 'savings' | 'credit'
    number: string
    balance: number
    selected?: boolean
  }
  
  export interface AccountSelectorProps {
    accounts: Account[]
    onChange?: (selectedAccounts: Account[]) => void
  }
  