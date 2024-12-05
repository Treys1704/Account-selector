import { AccountSelector } from './components/AccountSelector'
import { Account } from './types'

function App() {
  const accounts: Account[] = [
    {
      id: "1",
      type: "checking",
      number: "5501",
      balance: 32402.19,
    },
    {
      id: "2",
      type: "savings",
      number: "2399",
      balance: 10000.00,
    },
    {
      id: "3",
      type: "credit",
      number: "1767",
      balance: -2420.19,
    }
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <AccountSelector accounts={accounts} />
    </div>
  )
}

export default App
