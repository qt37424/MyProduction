<template>
  <div class="dashboard-page">
    <div class="dashboard-content">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <div class="welcome-card">
          <div class="welcome-icon">
            <i class="dashboard-icon">🎛️</i>
          </div>
          <h1 class="welcome-title">Welcome to IP Admin Dashboard</h1>
          <p class="welcome-subtitle">You are successfully logged in! Server monitoring tools are ready.</p>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🌐</div>
          <div class="stat-info">
            <h3 class="stat-number">1,247</h3>
            <p class="stat-label">Active IPs</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🚫</div>
          <div class="stat-info">
            <h3 class="stat-number">23</h3>
            <p class="stat-label">Blocked IPs</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⚠️</div>
          <div class="stat-info">
            <h3 class="stat-number">5</h3>
            <p class="stat-label">Alerts</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <h3 class="stat-number">99.8%</h3>
            <p class="stat-label">Uptime</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="actions-section">
        <h2 class="section-title">Quick Actions</h2>
        <div class="actions-grid">
          <button class="action-btn primary-action">
            <i class="btn-icon">👁️</i>
            <span>Monitor IPs</span>
          </button>
          
          <button class="action-btn secondary-action">
            <i class="btn-icon">⚙️</i>
            <span>Manage Whitelist</span>
          </button>
          
          <button class="action-btn warning-action">
            <i class="btn-icon">🚫</i>
            <span>Block IP</span>
          </button>
          
          <button class="action-btn info-action">
            <i class="btn-icon">📈</i>
            <span>View Analytics</span>
          </button>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="activity-section">
        <h2 class="section-title">Recent Activity</h2>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon success">✅</div>
            <div class="activity-content">
              <p class="activity-text">IP 192.168.1.100 added to whitelist</p>
              <span class="activity-time">2 minutes ago</span>
            </div>
          </div>
          
          <div class="activity-item">
            <div class="activity-icon warning">⚠️</div>
            <div class="activity-content">
              <p class="activity-text">Suspicious activity detected from 203.45.67.89</p>
              <span class="activity-time">15 minutes ago</span>
            </div>
          </div>
          
          <div class="activity-item">
            <div class="activity-icon error">🚫</div>
            <div class="activity-content">
              <p class="activity-text">IP 185.123.45.67 blocked for excessive requests</p>
              <span class="activity-time">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  mounted() {
    console.log('Dashboard mounted - user is authenticated');
    
    // Simulate loading data
    this.loadDashboardData();
  },
  methods: {
    loadDashboardData() {
      // Simulate API calls to load dashboard data
      console.log('Loading dashboard data...');
      
      // Here you would make actual API calls to get:
      // - Active IP count
      // - Blocked IP count  
      // - Recent alerts
      // - Server uptime
      // - Recent activity logs
    }
  }
}
</script>

<style scoped>
.dashboard-page {
  min-height: calc(100vh - 100px);
  padding: 20px;
  position: relative;
  z-index: 10;
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* Welcome Section */
.welcome-section {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.welcome-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 600px;
}

.welcome-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  border-radius: 50%;
  margin-bottom: 20px;
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
}

.dashboard-icon {
  font-size: 36px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.welcome-title {
  color: white;
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 10px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.welcome-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  margin: 0;
  line-height: 1.6;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.stat-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.stat-info {
  flex: 1;
}

.stat-number {
  color: white;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 5px 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 0;
  font-weight: 500;
}

/* Sections */
.actions-section,
.activity-section {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
  color: white;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 25px 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Actions Grid */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.primary-action {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.secondary-action {
  background: linear-gradient(135deg, #2196F3, #1976D2);
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
}

.warning-action {
  background: linear-gradient(135deg, #FF9800, #F57C00);
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);
}

.info-action {
  background: linear-gradient(135deg, #9C27B0, #7B1FA2);
  box-shadow: 0 4px 15px rgba(156, 39, 176, 0.3);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.btn-icon {
  font-size: 18px;
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: background 0.3s ease;
}

.activity-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.activity-icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.activity-icon.success {
  background: rgba(76, 175, 80, 0.2);
}

.activity-icon.warning {
  background: rgba(255, 152, 0, 0.2);
}

.activity-icon.error {
  background: rgba(244, 67, 54, 0.2);
}

.activity-content {
  flex: 1;
}

.activity-text {
  color: white;
  font-size: 14px;
  margin: 0 0 5px 0;
  line-height: 1.4;
}

.activity-time {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-page {
    padding: 15px;
  }
  
  .welcome-card {
    padding: 30px 20px;
  }
  
  .welcome-title {
    font-size: 24px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-section,
  .activity-section {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .stat-card {
    padding: 20px 15px;
  }
  
  .stat-number {
    font-size: 24px;
  }
  
  .welcome-icon {
    width: 60px;
    height: 60px;
  }
  
  .dashboard-icon {
    font-size: 28px;
  }
}

/* Entrance Animation */
.dashboard-page {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card,
.action-btn,
.activity-item {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }
.stat-card:nth-child(4) { animation-delay: 0.4s; }
</style>