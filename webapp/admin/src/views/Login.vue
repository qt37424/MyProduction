/*
=======================================================================================
* File : Login.vue
* Description : Login view of admin page
=======================================================================================
* History *
=======================================================================================
* Number | Date(YYYYMMDD) | Description
---------|----------------|------------------------------------------------------------
*      1 |   2025-09-02   | Initial version
=======================================================================================
*/

<template>
  <div class="login-form-container">
    <div class="login-card">
      <!-- Login Header -->
      <div class="login-header">
        <div class="login-icon">
          <i class="security-icon">🔐</i>
        </div>
        <h2 class="login-title">Admin Access</h2>
        <p class="login-subtitle">Secure login to IP Management System</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">
            <i class="input-icon">👤</i>
            Username
          </label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            class="form-input"
            placeholder="Enter your username"
            :class="{ 'error': errors.username }"
            @blur="validateUsername"
            @input="clearError('username')"
            required
          />
          <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">
            <i class="input-icon">🔒</i>
            Password
          </label>
          <div class="password-container">
            <input
              id="password"
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="Enter your password"
              :class="{ 'error': errors.password }"
              @blur="validatePassword"
              @input="clearError('password')"
              required
            />
            <button
              type="button"
              class="password-toggle"
              @click="togglePasswordVisibility"
              :title="showPassword ? 'Hide password' : 'Show password'"
            >
              <i>{{ showPassword ? '🙈' : '👁️' }}</i>
            </button>
          </div>
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="form-options">
          <label class="checkbox-container">
            <input v-model="formData.rememberMe" type="checkbox" class="checkbox-input">
            <span class="checkbox-custom"></span>
            <span class="checkbox-label">Remember me</span>
          </label>
          <a href="#" class="forgot-password" @click.prevent="handleForgotPassword">
            Forgot password?
          </a>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          class="login-button"
          :disabled="isLoading"
          :class="{ 'loading': isLoading }"
        >
          <span v-if="!isLoading" class="button-content">
            <i class="button-icon">🚀</i>
            LOGIN
          </span>
          <span v-else class="loading-content">
            <i class="loading-spinner">⏳</i>
            Authenticating...
          </span>
        </button>

        <!-- Error Alert -->
        <div v-if="loginError" class="error-alert">
          <i class="alert-icon">⚠️</i>
          {{ loginError }}
        </div>
      </form>

      <!-- Footer Links -->
      <div class="login-footer">
        <p class="register-text">
          Not registered? 
          <a href="#" class="register-link" @click.prevent="handleCreateAccount">
            Create an account
          </a>
        </p>
        <div class="security-info">
          <i class="shield-icon">🛡️</i>
          <span>Secured with 256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from "../api/http";
export default {
  name: "LoginComponent",
  emits: ["login-success", "show-register"],

  data() {
    return {
      formData: {
        username: '',
        password: '',
        rememberMe: false // need to assign to api (Store login forever)
      },
      errors: {},
      isLoading: false,
      showPassword: false,
      loginError: ''
    };
  },

  computed: {
    isFormValid() {
      return (
        this.formData.username.length >= 3 &&
        this.formData.password.length >= 6 &&
        Object.keys(this.errors).length === 0
      );
    },
  },

  methods: {
    validateField(field) {
      switch (field) {
        case "username":
          if (!this.formData.username.trim()) {
            this.errors.username = "Missing username";
          } else if (this.formData.username.length < 3) {
            this.errors.username = "Username has at least 3 characters";
          }
          break;

        case "password":
          if (!this.formData.password) {
            this.errors.password = "Missing password";
          } else if (this.formData.password.length < 6) {
            this.errors.password = "Password has at least 6 characters";
          }
          break;
      }
    },

    clearError(field) {
      if (this.errors[field]) {
        delete this.errors[field];
      }
    },

    validateForm() {
      this.errors = {};
      this.validateField("username");
      this.validateField("password");
      return Object.keys(this.errors).length === 0;
    },

    async handleLogin() {
      if (!this.validateForm()) return;

      this.isLoading = true;

      try {
        const response = await this.loginAPI({
          username: this.formData.username,
          password: this.formData.password,
        });

        if (response.success) {
          this.$emit("login-success", {
            user: response.user,
            token: response.token,
          });
        } else {
          this.errors.password =
            response.message || "Username or password is invalid";
        }
      } catch (error) {
        this.errors.password = "There is something wrong. Please try again!";
      } finally {
        this.isLoading = false;
      }
    },

    async loginAPI(credentials) {
      const response = await http.post("/auth/login", credentials)
      return response.data
    },

    resetForm() {
      this.formData = {
        username: "",
        password: "",
      };
      this.errors = {};
      this.isLoading = false;
    },
  },

  // Lifecycle hooks
  mounted() {
    console.log("Login component mounted");
  },

  beforeUnmount() {
    this.resetForm();
  },
};
</script>

<style scoped>
@import "../static/css/login.css";
</style>
