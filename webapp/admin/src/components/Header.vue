<template>
  <header class="professional-header">
    <nav class="nav-container">
      <div class="nav-content">
        <!-- Admin Branding -->
        <div class="admin-branding">
          <h1 class="brand-title">IP Admin Panel</h1>
          <span class="brand-subtitle">Server Access Control</span>
        </div>

        <!-- Navigation Links -->
        <div class="nav-links">
          <a 
            v-for="item in visibleMenuItems" 
            :key="item.key"
            href="#" 
            class="nav-link" 
            @click.prevent="navigateTo(item.key)"
            :class="{ 'active': currentRoute === item.key }"
          >
            <i class="nav-icon">{{ item.icon }}</i>
            <span>{{ item.label }}</span>
          </a>
        </div>

        <!-- User Actions -->
        <div class="user-actions">
          <!-- Purchase button - Hide on dashboard -->
          <a 
            v-if="showPurchaseButton"
            href="#" 
            class="action-link purchase-link" 
            @click.prevent="navigateTo('purchase')"
          >
            <i class="action-icon">💎</i>
            <span>PURCHASE</span>
          </a>
          <!-- Login/Logout button -->
          <a 
            href="#" 
            class="action-link auth-link" 
            @click.prevent="handleAuth"
            :class="{ 'logout-link': isAuthenticated }"
          >
            <i class="action-icon">{{ isAuthenticated ? '🚪' : '🔑' }}</i>
            <span>{{ isAuthenticated ? 'LOGOUT' : 'LOGIN' }}</span>
          </a>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: "ProfessionalHeader",
  props: {
    currentRoute: {
      type: String,
      default: "home",
    },
    isAuthenticated: {
      type: Boolean,
      default: false,
    },
    // Custom menu config
    menuConfig: {
      type: Object,
      default: () => ({
        showOnLogin: ['home', 'about', 'blog', 'contact'], // Chỉ show những này ở login
        showOnDashboard: ['home', 'about', 'services', 'showcase', 'blog', 'contact'], // Full menu ở dashboard
        showOnPublic: ['home', 'about', 'services', 'showcase', 'blog', 'contact'] // Full menu ở public pages
      })
    }
  },
  data() {
    return {
      // All available menu items
      allMenuItems: [
        { key: 'home', label: 'HOME', icon: '🏠' },
        { key: 'about', label: 'ABOUT', icon: 'ℹ️' },
        { key: 'services', label: 'SERVICES', icon: '🔧' },
        { key: 'showcase', label: 'SHOWCASE', icon: '🎯' },
        { key: 'blog', label: 'BLOG', icon: '📝' },
        { key: 'contact', label: 'CONTACT', icon: '📞' }
      ]
    }
  },
  computed: {
    // Determine which menu items to show based on current route
    visibleMenuItems() {
      let allowedItems = [];
      
      if (this.currentRoute === 'login') {
        allowedItems = this.menuConfig.showOnLogin;
      } else if (this.currentRoute === 'dashboard') {
        allowedItems = this.menuConfig.showOnDashboard;
      } else {
        allowedItems = this.menuConfig.showOnPublic;
      }
      
      return this.allMenuItems.filter(item => allowedItems.includes(item.key));
    },

    showPurchaseButton() {
      // Hide purchase button on dashboard and login
      return !['dashboard', 'login'].includes(this.currentRoute);
    },

    showAuthButton() {
      // Always show auth button
      return true;
    },

    isLoginPage() {
      return this.currentRoute === 'login';
    },

    isDashboard() {
      return this.currentRoute === 'dashboard';
    }
  },
  methods: {
    navigateTo(section) {
      // Emit event to parent component hoặc handle routing
      this.$emit("navigate", section);
      console.log(`Navigating to: ${section}`);

      // Nếu dùng Vue Router thì có thể:
      // this.$router.push(`/${section}`);
    },

    handleAuth() {
      if (this.isAuthenticated) {
        this.$emit("logout");
      } else {
        this.navigateTo("login");
      }
    },
  },
};
</script>

<style scoped>
/* Import CSS file */
@import "../static/css/header.css";
</style>
