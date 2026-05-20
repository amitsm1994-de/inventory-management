<template>
  <aside class="sidebar" :class="{ 'is-collapsed': isCollapsed }">
    <div class="sidebar-brand">
      <h1 v-show="!isCollapsed">{{ t('nav.companyName') }}</h1>
      <p v-show="!isCollapsed" class="brand-subtitle">{{ t('nav.subtitle') }}</p>
      <button
        v-if="canToggle"
        class="toggle-btn"
        :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        @click="toggle"
      >
        <component :is="isCollapsed ? PanelLeftOpen : PanelLeftClose" :size="18" aria-hidden="true" />
      </button>
    </div>

    <nav class="sidebar-nav" aria-label="Primary">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        active-class="is-active"
        exact-active-class="is-active-exact"
        :data-tooltip="t(item.labelKey)"
      >
        <component :is="item.icon" :size="18" aria-hidden="true" />
        <span v-show="!isCollapsed">{{ t(item.labelKey) }}</span>
      </router-link>
    </nav>

    <div class="sidebar-spacer" />

    <div class="sidebar-footer">
      <LanguageSwitcher />
      <ProfileMenu
        @show-profile-details="$emit('show-profile-details')"
        @show-tasks="$emit('show-tasks')"
      />
    </div>
  </aside>
</template>

<script>
import { useI18n } from '../composables/useI18n'
import { useNavigation } from '../composables/useNavigation'
import { useSidebarCollapsed } from '../composables/useSidebarCollapsed'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'
import LanguageSwitcher from './LanguageSwitcher.vue'
import ProfileMenu from './ProfileMenu.vue'

export default {
  name: 'Sidebar',
  components: { LanguageSwitcher, ProfileMenu },
  emits: ['show-profile-details', 'show-tasks'],
  setup() {
    const { t } = useI18n()
    const { navItems } = useNavigation()
    const { isCollapsed, canToggle, toggle } = useSidebarCollapsed()
    return { t, navItems, isCollapsed, canToggle, toggle, PanelLeftClose, PanelLeftOpen }
  }
}
</script>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
}

/* Brand area */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-2) var(--space-5);
  min-height: 60px;
}

.sidebar-brand h1 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
}

.brand-subtitle {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: var(--space-1) 0 0;
  display: block;
}

/* Collapsed brand: hide the text block, center the toggle */
.sidebar.is-collapsed .sidebar-brand {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-2) var(--space-5);
}

/* Toggle button */
.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--color-text-muted);
  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;
  margin-left: auto;
}

.sidebar.is-collapsed .toggle-btn {
  margin-left: 0;
}

.toggle-btn:hover {
  background: var(--color-bg);
  border-color: var(--color-border);
  color: var(--color-text);
}

.toggle-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Nav */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--color-text-muted);
  text-decoration: none;
  border-left: 3px solid transparent;
  transition: background-color 120ms ease, color 120ms ease, padding 180ms ease;
}

.nav-item:hover {
  background: var(--color-bg);
  color: var(--color-text);
}

.nav-item.is-active {
  background: var(--color-primary-soft);
  color: var(--color-primary);
  border-left-color: var(--color-primary);
}

.nav-item:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Collapsed nav items: center icon, hide label */
.sidebar.is-collapsed .nav-item {
  justify-content: center;
  padding: var(--space-2);
  border-left-color: transparent;
}

.sidebar.is-collapsed .nav-item.is-active {
  border-left-color: transparent;
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

/* Tooltip for collapsed mode */
.sidebar.is-collapsed .nav-item::after {
  content: attr(data-tooltip);
  position: absolute;
  left: calc(100% + var(--space-3));
  top: 50%;
  transform: translateY(-50%);
  background: var(--color-text);
  color: var(--color-surface);
  border-radius: var(--radius-md);
  padding: var(--space-1) var(--space-2);
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 120ms ease;
  transition-delay: 0ms;
  z-index: 200;
}

.sidebar.is-collapsed .nav-item:hover::after,
.sidebar.is-collapsed .nav-item:focus-visible::after {
  opacity: 1;
  transition-delay: 100ms;
}

/* Spacer */
.sidebar-spacer {
  flex: 1;
}

/* Footer */
.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-3);
}

/* Collapsed sidebar padding */
.sidebar.is-collapsed {
  padding: var(--space-3) var(--space-2);
}
</style>
