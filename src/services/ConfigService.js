const fs = require('fs');
const path = require('path');
class ConfigService {
  constructor() {
    // 配置文件路径
    this._configPath = path.join(__dirname, '../../data');
    this._configFile = this._configPath + '/config.json';
    this._config = {
      task: {
        taskExpireDays: 3,
        maxRetries: 3,        // 最大重试次数
        retryInterval: 300,   // 重试间隔（秒）
      },
      wecom: {
        enable: false,
        webhook: ''
      },
      telegram: {
        enable: false,
        proxyDomain: '',
        botToken: '',
        chatId: ''
      },
      wxpusher: {
        enable: false,
        spt: ''
      },
      proxy: {
        host: '',
        port: 0,
        username: '',
        password: ''
      }
    };
    this._init();
  }

  _init() {
    try {
      if (!fs.existsSync(this._configPath)) {
        fs.mkdirSync(this._configPath, { recursive: true });
      }
      if (fs.existsSync(this._configFile)) {
        const data = fs.readFileSync(this._configFile, 'utf8');
        this._config = { ...this._config, ...JSON.parse(data) };
      }else {
        this._saveConfig();
      }
    } catch (error) {
      console.error('系统配置初始化失败:', error);
    }
  }

  _saveConfig() {
    try {
      fs.writeFileSync(this._configFile, JSON.stringify(this._config, null, 2));
    } catch (error) {
      console.error('系统配置保存失败:', error);
    }
  }

  getConfig() {
    return this._config;
  }

  setConfig(config) {
    this._config = { ...this._config, ...config };
    this._saveConfig();
  }

  getConfigValue(key) {
    const keys = key.split('.');
    let value = this._config;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    return value;
  }

  setConfigValue(key, value) {
    const keys = key.split('.');
    let current = this._config;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    this._saveConfig();
  }
}

// 导出单例实例
module.exports = new ConfigService();
