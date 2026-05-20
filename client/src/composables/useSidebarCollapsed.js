import { ref, computed, onMounted, onUnmounted } from 'vue'

const BREAKPOINT = 1024
const STORAGE_KEY = 'sidebar-collapsed'

const isSmallScreen = ref(typeof window !== 'undefined' && window.innerWidth < BREAKPOINT)
const manualCollapsed = ref(
  typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) === 'true'
)

let listenerRefCount = 0
let resizeHandler = null

function attachResize() {
  if (listenerRefCount === 0) {
    resizeHandler = () => {
      isSmallScreen.value = window.innerWidth < BREAKPOINT
    }
    window.addEventListener('resize', resizeHandler)
  }
  listenerRefCount++
}

function detachResize() {
  listenerRefCount--
  if (listenerRefCount === 0 && resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
}

export function useSidebarCollapsed() {
  const isCollapsed = computed(() => isSmallScreen.value || manualCollapsed.value)
  const canToggle = computed(() => !isSmallScreen.value)

  const toggle = () => {
    if (!canToggle.value) return
    manualCollapsed.value = !manualCollapsed.value
    localStorage.setItem(STORAGE_KEY, String(manualCollapsed.value))
  }

  onMounted(attachResize)
  onUnmounted(detachResize)

  return {
    isCollapsed,
    canToggle,
    toggle,
  }
}
