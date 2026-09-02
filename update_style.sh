#!/bin/bash
FILE="/data/data/com.termux/files/home/Desktop/项目/vueproti2/src/views/services/JobListView.vue"

# Keep everything before <style scoped>
sed -n '1,/<style scoped>/p' "$FILE" > temp.vue

# Append new styles
cat << 'STYLE' >> temp.vue
.job-list-page {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f4f7f9;
}
.main-content {
  flex: 1;
  width: 1280px;
  margin: 0 auto;
  padding: 120px 0 40px 0;
}
.job-container {
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-top: 20px;
}
.tabs-header {
  display: flex;
  gap: 30px;
  border-bottom: 2px solid #f0f2f5;
  margin-bottom: 24px;
}
.tab-btn {
  padding: 12px 16px;
  font-size: 18px;
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  position: relative;
  transition: all 0.3s ease;
  font-weight: 500;
}
.tab-btn:hover {
  color: #3b82f6;
}
.tab-btn.active {
  color: #3b82f6;
  font-weight: bold;
}
.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 3px;
  background: #3b82f6;
  border-radius: 3px 3px 0 0;
}

.job-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.job-card {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.job-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}
.job-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}
.job-title {
  margin: 0;
  font-size: 18px;
  color: #1e293b;
  font-weight: 600;
}
.job-salary {
  color: #f97316;
  font-weight: bold;
  font-size: 18px;
}
.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}
.job-tags .tag {
  background: #f1f5f9;
  color: #475569;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}
.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #94a3b8;
  font-size: 14px;
  padding-top: 16px;
  border-top: 1px dashed #e2e8f0;
}
.company-name {
  color: #475569;
  font-weight: 500;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
}
.pagination button {
  padding: 8px 16px;
  border: 1px solid #cbd5e1;
  background: #fff;
  cursor: pointer;
  border-radius: 6px;
  color: #475569;
  font-weight: 500;
  transition: all 0.2s;
}
.pagination button:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #94a3b8;
}
.pagination button:disabled {
  background: #f8fafc;
  color: #cbd5e1;
  cursor: not-allowed;
}

.empty-state, .loading-state {
  text-align: center;
  padding: 60px;
  color: #94a3b8;
  font-size: 16px;
  grid-column: 1 / -1;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  width: 700px;
  max-width: 90vw;
  max-height: 85vh;
  border-radius: 12px;
  padding: 32px;
  position: relative;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
.modal-close-btn {
  position: absolute;
  top: 16px;
  right: 20px;
  font-size: 28px;
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  transition: color 0.2s;
}
.modal-close-btn:hover {
  color: #1e293b;
}
.detail-title {
  margin: 0 0 12px 0;
  font-size: 24px;
  color: #1e293b;
  font-weight: 700;
}
.detail-salary {
  color: #f97316;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 24px;
}
.detail-section {
  margin-bottom: 24px;
}
.detail-section h3 {
  font-size: 16px;
  color: #1e293b;
  margin-bottom: 12px;
  border-left: 4px solid #3b82f6;
  padding-left: 10px;
}
.detail-section p, .detail-html {
  color: #475569;
  line-height: 1.7;
  font-size: 15px;
}
</style>
STYLE

mv temp.vue "$FILE"
