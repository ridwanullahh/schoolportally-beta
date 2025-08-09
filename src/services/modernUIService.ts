// Modern UI/UX Service - Mobile app-like interactions and animations
class ModernUIService {
  private gestureHandlers = new Map<string, Function>();
  private animationObserver: IntersectionObserver | null = null;
  private touchStartY = 0;
  private touchStartX = 0;
  private isRefreshing = false;
  private isDarkMode = false;

  constructor() {
    this.initializeGestureSupport();
    this.initializeAnimationObserver();
    this.initializeDarkMode();
    this.initializeResponsiveDesign();
  }

  // Gesture Support
  private initializeGestureSupport(): void {
    // Pull to refresh
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });

    // Swipe navigation
    this.initializeSwipeNavigation();
  }

  private handleTouchStart(e: TouchEvent): void {
    this.touchStartY = e.touches[0].clientY;
    this.touchStartX = e.touches[0].clientX;
  }

  private handleTouchMove(e: TouchEvent): void {
    if (this.isRefreshing) return;

    const touchY = e.touches[0].clientY;
    const touchX = e.touches[0].clientX;
    const deltaY = touchY - this.touchStartY;
    const deltaX = touchX - this.touchStartX;

    // Pull to refresh (only at top of page)
    if (window.scrollY === 0 && deltaY > 0) {
      this.handlePullToRefresh(deltaY);
      if (deltaY > 50) {
        e.preventDefault(); // Prevent default scroll behavior
      }
    }

    // Horizontal swipe detection
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      this.handleSwipeGesture(deltaX > 0 ? 'right' : 'left');
    }
  }

  private handleTouchEnd(e: TouchEvent): void {
    const touchY = e.changedTouches[0].clientY;
    const deltaY = touchY - this.touchStartY;

    if (window.scrollY === 0 && deltaY > 100 && !this.isRefreshing) {
      this.triggerPullToRefresh();
    } else {
      this.resetPullToRefresh();
    }
  }

  private handlePullToRefresh(deltaY: number): void {
    const refreshIndicator = document.getElementById('pull-refresh-indicator');
    if (!refreshIndicator) {
      this.createPullRefreshIndicator();
    }

    const indicator = document.getElementById('pull-refresh-indicator');
    if (indicator) {
      const progress = Math.min(deltaY / 100, 1);
      indicator.style.transform = `translateY(${deltaY * 0.5}px) scale(${progress})`;
      indicator.style.opacity = progress.toString();

      if (progress >= 1) {
        indicator.classList.add('ready');
      } else {
        indicator.classList.remove('ready');
      }
    }
  }

  private createPullRefreshIndicator(): void {
    const indicator = document.createElement('div');
    indicator.id = 'pull-refresh-indicator';
    indicator.innerHTML = `
      <div class="refresh-spinner">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M23 4v6h-6M1 20v-6h6"/>
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4a9 9 0 0 1-14.85 3.36L23 14"/>
        </svg>
      </div>
    `;
    
    indicator.style.cssText = `
      position: fixed;
      top: -60px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 40px;
      background: var(--school-brand-primary, #2563eb);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      z-index: 1000;
      transition: all 0.3s ease;
      opacity: 0;
    `;

    document.body.appendChild(indicator);
  }

  private triggerPullToRefresh(): void {
    this.isRefreshing = true;
    const indicator = document.getElementById('pull-refresh-indicator');
    
    if (indicator) {
      indicator.style.transform = 'translateX(-50%) translateY(20px)';
      indicator.classList.add('refreshing');
      
      // Add spinning animation
      const spinner = indicator.querySelector('.refresh-spinner');
      if (spinner) {
        (spinner as HTMLElement).style.animation = 'spin 1s linear infinite';
      }
    }

    // Trigger refresh event
    window.dispatchEvent(new CustomEvent('pullToRefresh'));

    // Reset after 2 seconds
    setTimeout(() => {
      this.resetPullToRefresh();
    }, 2000);
  }

  private resetPullToRefresh(): void {
    this.isRefreshing = false;
    const indicator = document.getElementById('pull-refresh-indicator');
    
    if (indicator) {
      indicator.style.transform = 'translateX(-50%) translateY(-60px)';
      indicator.style.opacity = '0';
      indicator.classList.remove('ready', 'refreshing');
      
      const spinner = indicator.querySelector('.refresh-spinner');
      if (spinner) {
        (spinner as HTMLElement).style.animation = '';
      }
    }
  }

  // Swipe Navigation
  private initializeSwipeNavigation(): void {
    // Add swipe navigation for mobile
    this.addSwipeNavigation();
  }

  private addSwipeNavigation(): void {
    let startX = 0;
    let startY = 0;
    let isNavigating = false;

    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isNavigating = false;
    });

    document.addEventListener('touchmove', (e) => {
      if (isNavigating) return;

      const deltaX = e.touches[0].clientX - startX;
      const deltaY = e.touches[0].clientY - startY;

      // Only trigger if horizontal swipe is dominant
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 100) {
        isNavigating = true;
        
        if (deltaX > 0) {
          // Swipe right - go back
          this.handleSwipeNavigation('back');
        } else {
          // Swipe left - go forward (if applicable)
          this.handleSwipeNavigation('forward');
        }
      }
    });
  }

  private handleSwipeGesture(direction: 'left' | 'right'): void {
    window.dispatchEvent(new CustomEvent('swipeGesture', { 
      detail: { direction } 
    }));
  }

  private handleSwipeNavigation(direction: 'back' | 'forward'): void {
    if (direction === 'back' && window.history.length > 1) {
      window.history.back();
    }
  }

  // Animation Observer
  private initializeAnimationObserver(): void {
    this.animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all elements with animation classes
    this.observeAnimatedElements();
  }

  private observeAnimatedElements(): void {
    const animatedElements = document.querySelectorAll(
      '.fade-in, .slide-in-left, .slide-in-right, .slide-in-up, .slide-in-down, .scale-in'
    );

    animatedElements.forEach(element => {
      this.animationObserver?.observe(element);
    });
  }

  // Dark Mode Support
  private initializeDarkMode(): void {
    // Check for saved dark mode preference
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    this.isDarkMode = savedMode ? savedMode === 'true' : prefersDark;
    this.applyDarkMode();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('darkMode')) {
        this.isDarkMode = e.matches;
        this.applyDarkMode();
      }
    });
  }

  private applyDarkMode(): void {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    this.applyDarkMode();
    
    // Dispatch event for components to react
    window.dispatchEvent(new CustomEvent('darkModeToggle', {
      detail: { isDarkMode: this.isDarkMode }
    }));
  }

  // Responsive Design Enhancements
  private initializeResponsiveDesign(): void {
    this.handleOrientationChange();
    this.optimizeForTouch();
    this.addResponsiveClasses();
  }

  private handleOrientationChange(): void {
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        // Recalculate viewport height for mobile browsers
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Dispatch orientation change event
        window.dispatchEvent(new CustomEvent('orientationChanged', {
          detail: { 
            orientation: window.orientation,
            width: window.innerWidth,
            height: window.innerHeight
          }
        }));
      }, 100);
    });

    // Initial calculation
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  private optimizeForTouch(): void {
    // Add touch-friendly classes to interactive elements
    const interactiveElements = document.querySelectorAll(
      'button, a, input, select, textarea, [role="button"], [tabindex]'
    );

    interactiveElements.forEach(element => {
      element.classList.add('touch-optimized');
    });

    // Add touch feedback
    this.addTouchFeedback();
  }

  private addTouchFeedback(): void {
    document.addEventListener('touchstart', (e) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, [role="button"]')) {
        target.classList.add('touch-active');
      }
    });

    document.addEventListener('touchend', (e) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, [role="button"]')) {
        setTimeout(() => {
          target.classList.remove('touch-active');
        }, 150);
      }
    });
  }

  private addResponsiveClasses(): void {
    const updateResponsiveClasses = () => {
      const width = window.innerWidth;
      const body = document.body;

      // Remove existing responsive classes
      body.classList.remove('mobile', 'tablet', 'desktop', 'large-desktop');

      // Add appropriate class
      if (width < 768) {
        body.classList.add('mobile');
      } else if (width < 1024) {
        body.classList.add('tablet');
      } else if (width < 1440) {
        body.classList.add('desktop');
      } else {
        body.classList.add('large-desktop');
      }
    };

    updateResponsiveClasses();
    window.addEventListener('resize', updateResponsiveClasses);
  }

  // Page Transitions
  addPageTransition(type: 'fade' | 'slide' | 'scale' = 'fade'): void {
    const transitionElement = document.createElement('div');
    transitionElement.className = `page-transition page-transition-${type}`;
    transitionElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--school-brand-background, #ffffff);
      z-index: 9999;
      pointer-events: none;
    `;

    document.body.appendChild(transitionElement);

    // Animate in
    requestAnimationFrame(() => {
      transitionElement.classList.add('active');
    });

    // Remove after animation
    setTimeout(() => {
      transitionElement.remove();
    }, 300);
  }

  // Micro-interactions
  addMicroInteraction(element: HTMLElement, type: 'hover' | 'click' | 'focus'): void {
    const handler = () => {
      element.classList.add(`micro-${type}`);
      setTimeout(() => {
        element.classList.remove(`micro-${type}`);
      }, 200);
    };

    element.addEventListener(type === 'hover' ? 'mouseenter' : type, handler);
  }

  // Utility methods
  isMobile(): boolean {
    return window.innerWidth < 768;
  }

  isTablet(): boolean {
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  }

  isDesktop(): boolean {
    return window.innerWidth >= 1024;
  }

  getDarkMode(): boolean {
    return this.isDarkMode;
  }

  // Cleanup
  destroy(): void {
    this.animationObserver?.disconnect();
    this.gestureHandlers.clear();
    
    // Remove event listeners
    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('touchend', this.handleTouchEnd);
  }
}

// CSS for animations and interactions
const modernUIStyles = `
  .fade-in {
    opacity: 0;
    transition: opacity 0.6s ease;
  }

  .fade-in.animate-in {
    opacity: 1;
  }

  .slide-in-left {
    transform: translateX(-50px);
    opacity: 0;
    transition: transform 0.6s ease, opacity 0.6s ease;
  }

  .slide-in-left.animate-in {
    transform: translateX(0);
    opacity: 1;
  }

  .slide-in-right {
    transform: translateX(50px);
    opacity: 0;
    transition: transform 0.6s ease, opacity 0.6s ease;
  }

  .slide-in-right.animate-in {
    transform: translateX(0);
    opacity: 1;
  }

  .slide-in-up {
    transform: translateY(50px);
    opacity: 0;
    transition: transform 0.6s ease, opacity 0.6s ease;
  }

  .slide-in-up.animate-in {
    transform: translateY(0);
    opacity: 1;
  }

  .scale-in {
    transform: scale(0.8);
    opacity: 0;
    transition: transform 0.6s ease, opacity 0.6s ease;
  }

  .scale-in.animate-in {
    transform: scale(1);
    opacity: 1;
  }

  .touch-optimized {
    min-height: 44px;
    min-width: 44px;
    touch-action: manipulation;
  }

  .touch-active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .page-transition {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .page-transition.active {
    opacity: 1;
  }

  .micro-hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease;
  }

  .micro-click {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }

  .micro-focus {
    box-shadow: 0 0 0 3px rgba(var(--school-brand-primary), 0.3);
    transition: box-shadow 0.2s ease;
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = modernUIStyles;
document.head.appendChild(styleSheet);

export const modernUIService = new ModernUIService();
export default modernUIService;
