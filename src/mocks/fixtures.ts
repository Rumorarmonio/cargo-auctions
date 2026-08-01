import type {
  AuctionListItem,
  AuctionShowResponse,
  AuctionListItemTradingStatusMobile,
  BetItem,
} from '@/shared/api/generated/model'

export type AuctionFixture = {
  uuid: string
  listItem: AuctionListItem
  detail: AuctionShowResponse
  bets: BetItem[]
}

const routePoints = [
  {
    row_num: 1,
    op_type: 'Loading' as const,
    start_date: '2026-08-05T08:00:00+07:00',
    end_date: '2026-08-05T12:00:00+07:00',
    location: {
      city_name: 'Новосибирск',
      city_full_name: 'Новосибирская область, Новосибирск',
      city_gc_id: 1,
      loading_address: 'ул. Большевистская, 101',
      lon: 82.9357,
      lat: 55.0084,
    },
    cargo: {
      name: 'Электрооборудование',
      package_name: 'Паллеты',
      weight: '12.500',
      volume: '68.000',
      length: '13.600',
      width: '2.450',
      height: '2.700',
      oversized: false,
      package_amount: 18,
    },
    contact: { name: 'Иван Петров', phone: '+7 913 100-20-30' },
  },
  {
    row_num: 2,
    op_type: 'Unloading' as const,
    start_date: '2026-08-07T10:00:00+07:00',
    end_date: '2026-08-07T14:00:00+07:00',
    location: {
      city_name: 'Омск',
      city_full_name: 'Омская область, Омск',
      city_gc_id: 2,
      loading_address: 'пр-т Комарова, 12',
      lon: 73.3682,
      lat: 54.9914,
    },
    cargo: {
      name: 'Электрооборудование',
      package_name: 'Паллеты',
      weight: '12.500',
      volume: '68.000',
      oversized: false,
      package_amount: 18,
    },
    contact: { name: 'Мария Соколова', phone: '+7 913 100-20-31' },
  },
]

const basePayment = {
  condition: 'Оплата после предоставления документов',
  condition_predefined: 'По факту доставки',
  form: 'Безналичный расчёт',
  delay: 10,
  delay_type: 'CalendarDays' as const,
  currency_code: '643',
  prepay: 'Нет',
}

const createDetail = (
  uuid: string,
  overrides: Partial<AuctionShowResponse> = {},
): AuctionShowResponse => ({
  main: {
    id: 1001,
    cargo_num: 'CA-2026-001',
    cargo_date: '2026-08-05',
    order_uid: uuid,
    auc_type: 'Down',
    created_at: '2026-08-01T08:30:00+07:00',
  },
  organizer: {
    subscriber_id: 501,
    subscriber_code: 'SUB-501',
    organization_name: 'ООО «Сибирская логистика»',
    organization_inn: '5401001001',
    organization_kpp: '540101001',
    organization_id: 901,
  },
  contacts: [
    { name: 'Алексей Власов', phone: '+7 383 555-10-10', email: 'logistics@example.test' },
  ],
  cargo: {
    price: 'Не отображается',
    currency: 643,
    is_international: false,
    distance: 650,
    truck_count: 1,
    body_type: 'Тент',
    temp_from: null,
    temp_to: null,
    conics: 18,
    belts: 4,
    adr: null,
    coupling: false,
    air_pass: false,
    low_loader: false,
    additional_load: false,
    containered: false,
    container_type: null,
    container_size: null,
    loading_types: { side: true, top: false, rear: true, full: true },
    docs: { tir: false, cmr: true, t1: false, med: false },
    car: { type: 'Тент', weight: 20, volume: 90, width: 2.45, length: 13.6, height: 2.7 },
  },
  trading: {
    status: 'Auction',
    status_mobile: 'Losing',
    start_time: '2026-08-01T09:00:00+07:00',
    stop_time: '2026-08-04T18:00:00+07:00',
    bid_measurement_type: 'PerRoute',
    can_set_bet: true,
    allow_counter_bets: false,
    hide_bets_history: false,
    hide_places: false,
    no_view_cargo_price: true,
    hide_points_address_and_contacts: false,
    is_bidder: true,
    is_favorite: false,
    is_last_bet_with_vat: true,
    red_bet_with_vat: false,
    red_bet_no_vat: false,
    send_deal_before_load: false,
    chat_id: null,
    price: {
      start: 145000,
      start_no_vat: 120833.33,
      current: 132000,
      current_no_vat: 110000,
      available: 131000,
      available_no_vat: 109166.67,
      min: 100000,
      min_no_vat: 83333.33,
      max: 145000,
      max_no_vat: 120833.33,
      step: 1000,
      step_no_vat: 833.33,
      price_per_km: 203.08,
    },
    your: { bet: true, last_bet: 132000 },
    settings: {
      prolong_after_bet: 10,
      winner_confirm: 30,
      winner_counter_mode: 0,
      transmission_time_in: 24,
      coefficient: 1,
    },
  },
  payment: basePayment,
  assembly: { num: null, date: null },
  routes: routePoints,
  admitted_organizations: [
    {
      id: 901,
      inn: '5401001001',
      is_main: true,
      name: 'ООО «Сибирская логистика»',
      full_name: 'Общество с ограниченной ответственностью «Сибирская логистика»',
      site: null,
      subscriber_id: 501,
      subscriber_code: 'SUB-501',
      subscriber_role: 'Organizer',
      infobase_code: 'INFO-901',
      infobase_address: null,
      nalog_key: null,
      hide_me: false,
      current_vat_rate: '20',
    },
  ],
  hide_bets_history: false,
  ...overrides,
})

const createListItem = (detail: AuctionShowResponse): AuctionListItem => ({
  main: {
    id: detail.main.id,
    cargo_num: detail.main.cargo_num,
    cargo_date: detail.main.cargo_date,
    auc_type: detail.main.auc_type,
    order_uid: detail.main.order_uid,
    created_at: detail.main.created_at,
    is_assembly: detail.assembly.num !== null,
    price_per_km: detail.trading.price?.price_per_km,
  },
  organizer: detail.organizer,
  route: {
    load: {
      city: detail.routes[0]?.location?.city_name,
      address: detail.routes[0]?.location?.loading_address,
      date: detail.routes[0]?.start_date,
      city_gc_id: detail.routes[0]?.location?.city_gc_id,
      points_count: detail.routes.length,
    },
    unload: {
      city: detail.routes.at(-1)?.location?.city_name,
      address: detail.routes.at(-1)?.location?.loading_address,
      date: detail.routes.at(-1)?.start_date,
      city_gc_id: detail.routes.at(-1)?.location?.city_gc_id,
      points_count: detail.routes.length,
    },
  },
  cargo: {
    name: detail.routes[0]?.cargo?.name,
    weight: Number(detail.routes[0]?.cargo?.weight),
    volume: Number(detail.routes[0]?.cargo?.volume),
    body_type: detail.cargo.body_type,
    truck_count: detail.cargo.truck_count,
    is_cargo: true,
    is_international: detail.cargo.is_international,
    containered: detail.cargo.containered,
    loading_types: detail.cargo.loading_types,
    docs: detail.cargo.docs,
    car: detail.cargo.car
      ? {
          type: detail.cargo.car.type,
          weight: detail.cargo.car.weight ?? undefined,
          volume: detail.cargo.car.volume ?? undefined,
          width: detail.cargo.car.width ?? undefined,
          length: detail.cargo.car.length ?? undefined,
          height: detail.cargo.car.height ?? undefined,
        }
      : null,
  },
  trading: {
    status: detail.trading.status,
    status_mobile: detail.trading.status_mobile as AuctionListItemTradingStatusMobile | undefined,
    start_time: detail.trading.start_time,
    stop_time: detail.trading.stop_time,
    bid_measurement_type: detail.trading.bid_measurement_type,
    can_set_bet: detail.trading.can_set_bet,
    allow_counter_bets: detail.trading.allow_counter_bets,
    hide_points_address_and_contacts: detail.trading.hide_points_address_and_contacts,
    is_bidder: detail.trading.is_bidder,
    is_available: detail.trading.can_set_bet,
    is_accredited: true,
    is_favorite: detail.trading.is_favorite,
    price: detail.trading.price
      ? {
          start: detail.trading.price.start ?? undefined,
          current: detail.trading.price.current ?? undefined,
          current_no_vat: detail.trading.price.current_no_vat ?? undefined,
        }
      : null,
    your: detail.trading.your
      ? { bet: detail.trading.your.bet, last_bet: detail.trading.your.last_bet }
      : null,
  },
  payment: {
    form: detail.payment.form,
    currency_code: detail.payment.currency_code,
    consignor: 'ООО «Сибирская логистика»',
    consignee: 'ООО «ТрансСервис»',
  },
})

const makeBet = (
  id: number,
  auctionId: number,
  price: number,
  overrides: Partial<BetItem> = {},
): BetItem => ({
  id,
  created_at: '2026-08-01T12:00:00+07:00',
  auction_id: auctionId,
  subscriber_id: 700 + id,
  contact_name: `Перевозчик ${id}`,
  contact_phone: `+7 900 000-00-${String(id).padStart(2, '0')}`,
  price_with_vat: price,
  price_no_vat: Math.round((price / 1.2) * 100) / 100,
  organization_id: 1000 + id,
  organization_inn: `540100${String(id).padStart(4, '0')}`,
  organization_name: `ООО «Перевозчик ${id}»`,
  transporter_comment: null,
  is_rejected: false,
  is_counter: false,
  place: id,
  is_win: false,
  run_number: 0,
  cancel_reason: '',
  price_info: {
    price_with_vat: price,
    price_no_vat: Math.round((price / 1.2) * 100) / 100,
    payment_type: 'После доставки',
    vat_rate: '20',
  },
  ...overrides,
})

const firstDetail = createDetail('auction-nsk-001')
const hiddenBetsDetail = createDetail('auction-oms-002', {
  main: { ...firstDetail.main, id: 1002, cargo_num: 'CA-2026-002', auc_type: 'FixPrice' },
  trading: {
    ...firstDetail.trading,
    status: 'Planning',
    status_mobile: 'NotParticipating',
    can_set_bet: false,
    is_bidder: false,
    hide_bets_history: true,
    hide_points_address_and_contacts: true,
    your: { bet: false, last_bet: null },
    price: {
      ...firstDetail.trading.price,
      current: 98000,
      available: null,
      min: null,
      max: null,
      step: null,
    },
  },
  hide_bets_history: true,
})
const finishedDetail = createDetail('auction-tom-003', {
  main: { ...firstDetail.main, id: 1003, cargo_num: 'CA-2026-003', auc_type: 'Up' },
  trading: {
    ...firstDetail.trading,
    status: 'Finished',
    status_mobile: 'Winner',
    can_set_bet: false,
    is_bidder: true,
    your: { bet: true, last_bet: 210000 },
    price: { ...firstDetail.trading.price, current: 210000, available: null },
  },
})
const emptyBetsDetail = createDetail('auction-kem-004', {
  main: { ...firstDetail.main, id: 1004, cargo_num: 'CA-2026-004', auc_type: 'Request' },
  trading: {
    ...firstDetail.trading,
    status_mobile: 'NotParticipating',
    is_bidder: false,
    your: { bet: false, last_bet: null },
    price: { ...firstDetail.trading.price, current: 118000, available: 117000 },
  },
})

export const auctionFixtures: AuctionFixture[] = [
  {
    uuid: 'auction-nsk-001',
    listItem: createListItem(firstDetail),
    detail: firstDetail,
    bets: [
      makeBet(1, 1001, 132000, { is_win: true, place: 1 }),
      makeBet(2, 1001, 133000, { place: 2 }),
      makeBet(3, 1001, 135000, {
        is_rejected: true,
        cancel_reason: 'Ставка отменена перевозчиком',
        place: null,
      }),
    ],
  },
  {
    uuid: 'auction-oms-002',
    listItem: createListItem(hiddenBetsDetail),
    detail: hiddenBetsDetail,
    bets: [makeBet(4, 1002, 98000, { is_win: true, place: 1 })],
  },
  {
    uuid: 'auction-tom-003',
    listItem: createListItem(finishedDetail),
    detail: finishedDetail,
    bets: [
      makeBet(5, 1003, 210000, { is_win: true, place: 1 }),
      makeBet(6, 1003, 215000, { place: 2 }),
    ],
  },
  {
    uuid: 'auction-kem-004',
    listItem: createListItem(emptyBetsDetail),
    detail: emptyBetsDetail,
    bets: [],
  },
]
