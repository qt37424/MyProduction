<template>
  <div id="app">
    <!-- Global Header - Display all pages -->
    <ProfessionalHeader
      @navigate="handleGlobalNavigation"
      @logout="handleLogout"
      :current-route="currentRoute"
      :is-authenticated="isAuthenticated.value"
    />
    <!-- Main Content - Router View -->
    <main class="app-main">
      <router-view
        @login-success="handleLoginSuccess"
        @navigate="handleGlobalNavigation"
      />
    </main>
    <!-- Global Background for whole app -->
    <div class="global-background">
      <div class="gradient-orb gradient-orb-1"></div>
      <div class="gradient-orb gradient-orb-2"></div>
      <div class="gradient-orb gradient-orb-3"></div>
      <div class="floating-particles">
        <div class="particle" v-for="n in 20" :key="n"></div>
      </div>
    </div>
    <!-- Global Loading Overlay (if neccessary) -->
    <div v-if="isGlobalLoading" class="global-loading">
      <div class="loading-spinner">
        <i>⏳</i>
        <span>Loading...</span>
      </div>
    </div>
    <!-- Global Notifications Container -->
    <div class="notifications-container">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification', `notification-${notification.type}`]"
      >
        <i class="notification-icon">{{
          getNotificationIcon(notification.type)
        }}</i>
        <span>{{ notification.message }}</span>
        <button
          @click="removeNotification(notification.id)"
          class="notification-close"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>
<script>
// Import components
import ProfessionalHeader from "./components/Header.vue";
import { authStore } from './api/authen/auth';
export default {
  name: "App",
  components: {
    ProfessionalHeader,
  },
  data() {
    return {
      currentRoute: "login", // Track current route
      isGlobalLoading: false,
      notifications: [], // Global notifications
      notificationId: 0,
      userToken: null, // Store authentication token
      userData: null, // Store user data
    };
  },
  computed: {
    isAuthenticated() {
      return authStore.isAuthenticated;
    },
  },
  watch: {
    // Watch route changes
    $route(to) {
      this.currentRoute = to.name || to.path.replace("/", "") || "home";
      console.log("Route changed to:", this.currentRoute);
    },
  },
  methods: {
    handleGlobalNavigation(section) {
      console.log(`Global navigation to: ${section}`);
      this.currentRoute = section;
      // Handle navigation với Vue Router
      if (this.$router) {
        // Map sections to actual routes
        const routeMap = {
          'home': '/',
          'about': '/about',
          'services': '/services',
          'showcase': '/showcase', 
          'blog': '/blog',
          'contact': '/contact',
          'purchase': '/purchase',
          'login': '/login',
        };
        const targetRoute = routeMap[section] || `/${section}`;

        if (this.$route.path !== targetRoute) {
          this.$router.push(targetRoute).catch((err) => {
            console.log(
              "Navigation error (this is normal for same route):",
              err.message
            );
          });
        }
      }
    },

    handleLoginSuccess(userData) {
      // console.log('✅ Login successful:', userData);

      if (!userData.token) { // 1. VALIDATE: Check token is existed?
        console.error('❌ Missing token in userData');
        this.showNotification('error', 'Login failed: Invalid response');
        return;
      }

      const saved = authStore.saveAuth(userData.token, { // 2. Store token
        username: userData.user.username,
        loginTime: new Date().toISOString(),
        // rememberMe: userData.rememberMe
      });

      if (!saved) {
        this.showNotification('error', 'Failed to save authentication');
        return;
      }

      // 3. Update UI
      this.$forceUpdate();
      this.showNotification('success', `Welcome back, ${userData.user.username}!`);

      // Redirect to dashboard after short delay
      setTimeout(() => {
        this.handleGlobalNavigation("home");
      }, 500); // 500ms to redirect to home
    },

    handleLogout() {
      console.log('Logout requested');

      const username = this.userData ? this.userData.username : 'User';

      // Clear authentication data
      this.userToken = null;
      this.userData = null;

      // Force Vue to update
      this.$forceUpdate();
      this.$nextTick(() => {
        console.log('Authentication state after logout:', {
          token: this.userToken,
          user: this.userData,
          isAuthenticated: this.isAuthenticated,
          authVersion: this.authVersion
        });
      });
    },

    // Global notification system
    showNotification(type, message, duration = 4000) {
      const notification = {
        id: ++this.notificationId,
        type, // success, error, warning, info
        message,
        timestamp: Date.now(),
      };
      this.notifications.push(notification);
      // Auto remove after duration
      if (duration > 0) {
        setTimeout(() => {
          this.removeNotification(notification.id);
        }, duration);
      }
    },

    removeNotification(id) {
      const index = this.notifications.findIndex((n) => n.id === id);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    },

    getNotificationIcon(type) {
      const icons = {
        success: "✅",
        error: "❌",
        warning: "⚠️",
        info: "ℹ️",
      };
      return icons[type] || "ℹ️";
    },

    // Global loading methods
    showGlobalLoading() {
      this.isGlobalLoading = true;
    },

    hideGlobalLoading() {
      this.isGlobalLoading = false;
    },

    // Global error handler
    handleGlobalError(error) {
      console.error("Global error:", error);
      this.showNotification("error", error.message || "An error occurred");
      this.hideGlobalLoading();
    },

    // Check authentication on app start
    checkAuthentication() {
    },
  },

  created() {
    // Initialize app
    console.log("App created - initializing...");
    this.checkAuthentication();
    // Set current route on app start
    if (this.$route) {
      this.currentRoute =
        this.$route.name || this.$route.path.replace("/", "") || "home";
    }
  },

  mounted() {
    console.log("App mounted successfully");
    // Add global event listeners if needed
    window.addEventListener("online", () => {
      this.showNotification("success", "Connection restored");
    });
    window.addEventListener("offline", () => {
      this.showNotification("warning", "Connection lost", 0); // Don't auto-hide
    });
  },

  beforeDestroy() {
    // Cleanup global event listeners
    window.removeEventListener("online", () => {});
    window.removeEventListener("offline", () => {});
  },
};
</script>
<style scoped>
/* Import CSS file */
@import "./static/css/main.css";
</style>
