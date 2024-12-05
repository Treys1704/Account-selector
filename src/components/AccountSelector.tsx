import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CreditCard, ChevronsUpDown } from 'lucide-react'
import { cn } from "@/lib/utils"

import { Account, AccountSelectorProps } from "../types"

export function AccountSelector({ accounts: initialAccounts, onChange }: AccountSelectorProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [accounts, setAccounts] = React.useState(initialAccounts)
  const [selectedAccount, setSelectedAccount] = React.useState<Account | null>(null)
  
  const selectedAccounts = accounts.filter(account => account.selected)
  const allSelected = selectedAccounts.length === accounts.length
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
  
  const toggleAccount = (accountId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setAccounts(prev => {
      const newAccounts = prev.map(account => 
        account.id === accountId 
          ? { ...account, selected: !account.selected }
          : account
      )
      const newSelectedAccounts = newAccounts.filter(account => account.selected)
      if (newSelectedAccounts.length === 0 || newSelectedAccounts.length === newAccounts.length) {
        setSelectedAccount(null)
      } else if (newSelectedAccounts.length === 1) {
        setSelectedAccount(newSelectedAccounts[0])
      }
      return newAccounts
    })
  }

  const selectSingleAccount = (account: Account) => {
    if (selectedAccount?.id === account.id) {
      setSelectedAccount(null)
      setAccounts(prev => prev.map(a => ({ ...a, selected: true })))
    } else {
      setSelectedAccount(account)
      setAccounts(prev => prev.map(a => ({ ...a, selected: a.id === account.id })))
    }
    setIsExpanded(false)
  }

  React.useEffect(() => {
    onChange?.(selectedAccounts)
  }, [selectedAccounts, onChange])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getHeaderText = () => {
    if (allSelected || selectedAccounts.length === 0) return "All Accounts"
    if (selectedAccounts.length === 1) return selectedAccounts[0].type.charAt(0).toUpperCase() + selectedAccounts[0].type.slice(1)
    return selectedAccounts.map(a => a.type.charAt(0).toUpperCase() + a.type.slice(1)).join(", ")
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-2">
      <motion.div
        className="bg-white rounded-lg shadow-sm border"
        layout
      >
        {/* Header */}
        <motion.button
          className={cn(
            "w-full px-4 py-3 flex items-center justify-between",
            "hover:bg-gray-50 transition-colors rounded-lg",
            isExpanded && "bg-gray-50"
          )}
          onClick={() => setIsExpanded(!isExpanded)}
          layout
        >
          <span className="font-medium">{getHeaderText()}</span>
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {formatCurrency(selectedAccount ? selectedAccount.balance : totalBalance)}
            </span>
            {isExpanded ? <ChevronsUpDown size={20} /> : <ChevronsUpDown size={20} />}
          </div>
        </motion.button>
      </motion.div>

      {/* Expanded Account List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            {accounts.map((account) => (
              <motion.div
                key={account.id}
                className={cn(
                  "px-4 py-3 flex items-center justify-between",
                  "hover:bg-gray-50 transition-colors cursor-pointer",
                  account.selected && !allSelected && "bg-gray-100 rounded-md my-1 mx-2"
                )}
                onClick={() => selectSingleAccount(account)}
                layout
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-5 h-5"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => toggleAccount(account.id, e)}
                  >
                    <CreditCard className={cn(
                      "w-5 h-5",
                      account.selected ? "text-blue-500" : "text-gray-400"
                    )} />
                  </motion.div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{account.type}</span>
                    <span className="text-gray-500">· {account.number}</span>
                  </div>
                </div>
                <span className={cn(
                  "font-medium",
                  account.balance < 0 && "text-red-500"
                )}>
                  {formatCurrency(account.balance)}
                </span>
              </motion.div>
            ))}
            
            {/* All Accounts row */}
            <motion.div
              className={cn(
                "px-4 py-3 flex items-center justify-between border-t",
                allSelected && "bg-gray-100 rounded-md my-1 mx-2"
              )}
              layout
            >
              <span className="font-medium">All accounts</span>
              <span className="font-medium">{formatCurrency(totalBalance)}</span>
            </motion.div>

            {/* Footer */}
            <div className="px-4 py-3 border-t">
              <button
                className="w-full py-2 text-center text-sm text-gray-600 hover:text-gray-900"
                onClick={(e) => {
                  e.stopPropagation()
                  // Add your connection management logic here
                }}
              >
                Add or manage connections
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

