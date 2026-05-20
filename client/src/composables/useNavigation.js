import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  TrendingUp,
  BarChart3,
} from 'lucide-vue-next'

export const navItems = [
  { path: '/',          labelKey: 'nav.overview',        icon: LayoutDashboard },
  { path: '/inventory', labelKey: 'nav.inventory',       icon: Package },
  { path: '/orders',    labelKey: 'nav.orders',          icon: ShoppingCart },
  { path: '/spending',  labelKey: 'nav.finance',         icon: Wallet },
  { path: '/demand',    labelKey: 'nav.demandForecast',  icon: TrendingUp },
  { path: '/reports',   labelKey: 'nav.reports',         icon: BarChart3 },
]

export function useNavigation() {
  return { navItems }
}
