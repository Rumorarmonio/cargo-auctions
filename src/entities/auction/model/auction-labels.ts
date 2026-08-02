const auctionLabels: Record<string, string> = {
  Request: 'Заявка',
  Up: 'Повышение',
  Down: 'Понижение',
  FixPrice: 'Фиксированная цена',
  Planning: 'Планирование',
  Auction: 'Идут торги',
  DeterminateWinner: 'Определение победителя',
  WaitDeal: 'Ожидание сделки',
  InProgress: 'В работе',
  Finished: 'Завершён',
  Stopped: 'Остановлен',
  Canceled: 'Отменён',
  PerRoute: 'За рейс',
  PerKm: 'За километр',
  CalendarDays: 'календарных дней',
  WorkDays: 'рабочих дней',
  Leading: 'Вы лидируете',
  Losing: 'Ваша ставка перебита',
  Winner: 'Вы победили',
  NotParticipating: 'Не участвуете',
  Confirmed: 'Подтверждена',
  Loading: 'Погрузка',
  Unloading: 'Выгрузка',
}

export function getAuctionLabel(value?: string | null) {
  return value ? (auctionLabels[value] ?? value) : '—'
}
