export const getWeekDays = (date: Date): Date[] => {
  const result: Date[] = []
  const currentDay = date.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Predpokladáme, že týždeň začína v pondelok
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() - (currentDay === 0 ? 6 : currentDay - 1))

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    result.push(day)
  }

  return result
}
