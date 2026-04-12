import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddEntryCard } from '@/components/dashboard/add-entry-card'

type OnAddFn = (dates: string | string[], durationMinutes: number, ratePerHour: number) => void

describe('AddEntryCard (unit)', () => {
  let onAdd: ReturnType<typeof vi.fn<OnAddFn>>

  beforeEach(() => {
    onAdd = vi.fn<OnAddFn>()
  })

  it('should render the form with all fields', () => {
    render(<AddEntryCard onAdd={onAdd} />)

    expect(screen.getByText('Adicionar Dia')).toBeInTheDocument()
    expect(screen.getByText('Data')).toBeInTheDocument()
    expect(screen.getByText('Horas')).toBeInTheDocument()
    expect(screen.getByText('Valor/Hora')).toBeInTheDocument()
    expect(screen.getByText('Adicionar')).toBeInTheDocument()
  })

  it('should always show the custom calendar (not native date input)', () => {
    render(<AddEntryCard onAdd={onAdd} />)

    // Should NOT have a native date input
    const dateInputs = document.querySelectorAll('input[type="date"]')
    expect(dateInputs).toHaveLength(0)

    // Should have the calendar grid with day headers (D, S, T, Q, Q, S, S)
    expect(screen.getByText('D')).toBeInTheDocument()
    expect(screen.getAllByText('T')).toHaveLength(1)
    // Q and S appear multiple times due to day headers and other text
    expect(screen.getAllByText('Q').length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText('S').length).toBeGreaterThanOrEqual(2)
  })

  it('should have today pre-selected in single mode', () => {
    render(<AddEntryCard onAdd={onAdd} />)

    const today = new Date().getDate()
    const todayButton = screen.getByRole('button', { name: String(today), pressed: true })
    expect(todayButton).toBeInTheDocument()
  })

  it('should show error when hours are empty', async () => {
    render(<AddEntryCard onAdd={onAdd} />)

    const rateInput = screen.getByPlaceholderText('Ex: 50.00')
    await userEvent.type(rateInput, '50')

    const submitButton = screen.getByText('Adicionar')
    fireEvent.click(submitButton)

    expect(screen.getByText('Informe as horas no formato HH:MM (ex: 9:00).')).toBeInTheDocument()
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('should show error when rate is empty', async () => {
    render(<AddEntryCard onAdd={onAdd} />)

    const hoursInput = screen.getByPlaceholderText('Ex: 9:00')
    await userEvent.type(hoursInput, '8:00')

    const submitButton = screen.getByText('Adicionar')
    fireEvent.click(submitButton)

    expect(screen.getByText('Informe um valor/hora válido.')).toBeInTheDocument()
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('should call onAdd with correct values on submit', async () => {
    render(<AddEntryCard onAdd={onAdd} />)

    const hoursInput = screen.getByPlaceholderText('Ex: 9:00')
    const rateInput = screen.getByPlaceholderText('Ex: 50.00')

    await userEvent.type(hoursInput, '8:00')
    await userEvent.type(rateInput, '50')

    const submitButton = screen.getByText('Adicionar')
    fireEvent.click(submitButton)

    expect(onAdd).toHaveBeenCalledWith(
      expect.any(String), // the selected date
      480, // 8 hours = 480 minutes
      50,
    )
  })

  it('should show error when no date is selected after clearing', async () => {
    render(<AddEntryCard onAdd={onAdd} />)

    // Clear selected dates
    const clearButton = screen.getByText('Limpar')
    fireEvent.click(clearButton)

    const hoursInput = screen.getByPlaceholderText('Ex: 9:00')
    const rateInput = screen.getByPlaceholderText('Ex: 50.00')
    await userEvent.type(hoursInput, '8:00')
    await userEvent.type(rateInput, '50')

    const submitButton = screen.getByText('Adicionar')
    fireEvent.click(submitButton)

    expect(screen.getByText('Selecione pelo menos um dia no calendário.')).toBeInTheDocument()
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('should toggle to multi-mode and back', () => {
    render(<AddEntryCard onAdd={onAdd} />)

    const toggleButton = screen.getByText('Selecionar vários dias')
    fireEvent.click(toggleButton)

    expect(screen.getByText('Selecionar 1 dia')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Selecionar 1 dia'))
    expect(screen.getByText('Selecionar vários dias')).toBeInTheDocument()
  })

  it('should not have inputMode=numeric on hours input', () => {
    render(<AddEntryCard onAdd={onAdd} />)

    const hoursInput = screen.getByPlaceholderText('Ex: 9:00')
    expect(hoursInput).not.toHaveAttribute('inputMode', 'numeric')
  })

  it('should accept decimal hour format', async () => {
    render(<AddEntryCard onAdd={onAdd} />)

    const hoursInput = screen.getByPlaceholderText('Ex: 9:00')
    const rateInput = screen.getByPlaceholderText('Ex: 50.00')

    await userEvent.type(hoursInput, '9.5')
    await userEvent.type(rateInput, '50')

    fireEvent.click(screen.getByText('Adicionar'))

    expect(onAdd).toHaveBeenCalledWith(
      expect.any(String),
      570, // 9.5h = 570 min
      50,
    )
  })

  it('should navigate months with chevron buttons', () => {
    render(<AddEntryCard onAdd={onAdd} />)

    const prevButton = screen.getByLabelText('Mês anterior')
    const nextButton = screen.getByLabelText('Próximo mês')

    // Get current month label
    const now = new Date()
    const currentLabel = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    expect(screen.getByText(currentLabel)).toBeInTheDocument()

    // Navigate to next month
    fireEvent.click(nextButton)

    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    const nextLabel = nextMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    expect(screen.getByText(nextLabel)).toBeInTheDocument()

    // Navigate back
    fireEvent.click(prevButton)
    expect(screen.getByText(currentLabel)).toBeInTheDocument()
  })
})
