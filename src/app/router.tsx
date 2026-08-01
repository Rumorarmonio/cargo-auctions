import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import { auctionsListSearchSchema } from '@/entities/auction/model/auctions-list-search'
import { AuctionDetailPage } from '@/pages/auction-detail/auction-detail-page.component'
import { AuctionBetPage } from '@/pages/auction-bet/auction-bet-page.component'
import { AuctionsListPage } from '@/pages/auctions-list/auctions-list-page.component'
import { AppShell } from './shell/app-shell.component'

const rootRoute = createRootRoute({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/auctions', search: { page: 1, per_page: 2 } })
  },
})

const auctionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auctions',
  validateSearch: auctionsListSearchSchema,
  component: AuctionsListPage,
})

const auctionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auctions/$auctionUuid',
  component: AuctionDetailPage,
})

const auctionBetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auctions/$auctionUuid/bet',
  component: AuctionBetPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  auctionsRoute,
  auctionDetailRoute,
  auctionBetRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
