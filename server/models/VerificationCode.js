// 验证码存储（内存）
let verificationCodes = {};

class VerificationCode {
  // 生成验证码
  static generate(phone) {
    const code = Math.random().toString().slice(2, 8); // 6位数字
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10分钟有效期

    verificationCodes[phone] = {
      code,
      expiresAt,
      attempts: 0,
      maxAttempts: 5
    };

    console.log(`[演示模式] 手机 ${phone} 的验证码: ${code}`);
    return code;
  }

  // 验证码
  static verify(phone, code) {
    const record = verificationCodes[phone];

    if (!record) {
      return {
        success: false,
        message: '验证码不存在或已过期'
      };
    }

    // 检查是否过期
    if (Date.now() > record.expiresAt) {
      delete verificationCodes[phone];
      return {
        success: false,
        message: '验证码已过期'
      };
    }

    // 检查尝试次数
    if (record.attempts >= record.maxAttempts) {
      delete verificationCodes[phone];
      return {
        success: false,
        message: '验证次数过多，请重新获取验证码'
      };
    }

    // 验证码匹配
    if (record.code === code) {
      delete verificationCodes[phone];
      return {
        success: true,
        message: '验证成功'
      };
    }

    record.attempts++;
    return {
      success: false,
      message: `验证码错误，还有 ${record.maxAttempts - record.attempts} 次机会`
    };
  }

  // 清除过期的验证码
  static cleanup() {
    const now = Date.now();
    for (const phone in verificationCodes) {
      if (now > verificationCodes[phone].expiresAt) {
        delete verificationCodes[phone];
      }
    }
  }
}

// 每5分钟清理一次过期验证码
setInterval(() => VerificationCode.cleanup(), 5 * 60 * 1000);

module.exports = VerificationCode;

