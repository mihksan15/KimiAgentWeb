import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Expense } from '@/types';
import { initialExpenses, generateExpenseId, expenseCategories } from '@/data/products';

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Expense;
  updateExpense: (id: string, data: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getExpenseById: (id: string) => Expense | undefined;
  getExpensesByDateRange: (startDate: string, endDate: string) => Expense[];
  getExpensesByCategory: (category: string) => Expense[];
  getTotalExpenses: (startDate?: string, endDate?: string) => number;
  getDailyExpenses: () => number;
  getWeeklyExpenses: () => number;
  getMonthlyExpenses: () => number;
  exportExpenses: () => Expense[];
  importExpenses: (expensesData: Partial<Expense>[]) => { success: number; failed: number; errors: string[] };
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('ulfamart-expenses');
    if (savedExpenses) {
      try {
        const parsedExpenses = JSON.parse(savedExpenses);
        setExpenses(parsedExpenses);
      } catch (error) {
        console.error('Failed to parse expenses:', error);
        setExpenses(initialExpenses);
      }
    } else {
      setExpenses(initialExpenses);
    }
  }, []);

  // Save expenses to localStorage on change
  useEffect(() => {
    localStorage.setItem('ulfamart-expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'createdAt'>): Expense => {
    const newExpense: Expense = {
      ...expense,
      id: generateExpenseId(),
      createdAt: new Date().toISOString()
    };

    setExpenses(prev => [newExpense, ...prev]);
    return newExpense;
  }, []);

  const updateExpense = useCallback((id: string, data: Partial<Expense>) => {
    setExpenses(prev =>
      prev.map(expense =>
        expense.id === id ? { ...expense, ...data } : expense
      )
    );
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  }, []);

  const getExpenseById = useCallback((id: string) => {
    return expenses.find(expense => expense.id === id);
  }, [expenses]);

  const getExpensesByDateRange = useCallback((startDate: string, endDate: string) => {
    return expenses.filter(expense =>
      expense.date >= startDate && expense.date <= endDate
    );
  }, [expenses]);

  const getExpensesByCategory = useCallback((category: string) => {
    return expenses.filter(expense => expense.category === category);
  }, [expenses]);

  const getTotalExpenses = useCallback((startDate?: string, endDate?: string) => {
    let filteredExpenses = expenses;
    if (startDate && endDate) {
      filteredExpenses = expenses.filter(expense =>
        expense.date >= startDate && expense.date <= endDate
      );
    }
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const getDailyExpenses = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    return expenses
      .filter(expense => expense.date === today)
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const getWeeklyExpenses = useCallback(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekAgoStr = weekAgo.toISOString().slice(0, 10);
    return expenses
      .filter(expense => expense.date >= weekAgoStr)
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const getMonthlyExpenses = useCallback(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return expenses
      .filter(expense => expense.date.startsWith(currentMonth))
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const exportExpenses = useCallback(() => {
    return expenses;
  }, [expenses]);

  const importExpenses = useCallback((expensesData: Partial<Expense>[]) => {
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    const newExpenses: Expense[] = [];

    expensesData.forEach((data, index) => {
      try {
        if (!data.date || !data.category || !data.description || !data.amount) {
          failed++;
          errors.push(`Baris ${index + 1}: Tanggal, kategori, deskripsi, dan jumlah wajib diisi`);
          return;
        }

        const newExpense: Expense = {
          id: data.id || generateExpenseId(),
          date: data.date,
          category: data.category,
          description: data.description,
          amount: Number(data.amount),
          notes: data.notes || '',
          createdAt: new Date().toISOString()
        };

        newExpenses.push(newExpense);
        success++;
      } catch (error) {
        failed++;
        errors.push(`Baris ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    if (newExpenses.length > 0) {
      setExpenses(prev => [...newExpenses, ...prev]);
    }

    return { success, failed, errors };
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpenseById,
        getExpensesByDateRange,
        getExpensesByCategory,
        getTotalExpenses,
        getDailyExpenses,
        getWeeklyExpenses,
        getMonthlyExpenses,
        exportExpenses,
        importExpenses
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
}

export { expenseCategories };
