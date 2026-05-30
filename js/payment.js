let selectedPlan = null;

function processPayment(plan) {
    // 游客模式：禁止购买会员
    if (window._isGuestMode || !currentUser) {
        customConfirm('🔒 购买会员需要先登录或注册账号！\n\n注册后即可享受专属会员权益，点击确认前往登录/注册', (confirmed) => {
            if (confirmed) {
                exitGuestMode('login');
            }
        });
        return;
    }
    
    selectedPlan = MEMBERSHIP_PLANS[plan];
    if (!selectedPlan) return;
    
    // 检查新人单次卡是否已使用
    if (plan === 'newbie') {
        const newbieUsed = localStorage.getItem('wancheng_newbie_used');
        if (newbieUsed === 'true') {
            customAlert('您已经领取过新人单次卡，每个账号只能领取一次哦！');
            return;
        }
    }
    
    customConfirm(`确认购买${selectedPlan.name}，价格 ¥${selectedPlan.price} 吗？`, (confirmed) => {
        if (confirmed) {
            document.getElementById('vipModal')?.classList.remove('active');
            document.getElementById('paymentMethodModal')?.classList.add('active');
        }
    });
}

function showQrcode(method) {
    const paymentMethodModal = document.getElementById('paymentMethodModal');
    const qrcodeModal = document.getElementById('qrcodeModal');
    const qrcodeImage = document.getElementById('qrcodeImage');
    const qrcodeTitle = document.getElementById('qrcodeTitle');
    const qrcodeNote = document.getElementById('qrcodeNote');
    
    if (paymentMethodModal) paymentMethodModal.classList.remove('active');
    
    if (method === 'wechat') {
        qrcodeImage.src = 'images/WeChatpay.png';
        qrcodeTitle.innerText = '微信扫码支付';
        qrcodeNote.innerText = `请使用微信扫描二维码支付 ¥${selectedPlan.price} 元`;
    } else {
        qrcodeImage.src = 'images/Alipay.jpg';
        qrcodeTitle.innerText = '支付宝扫码支付';
        qrcodeNote.innerText = `请使用支付宝扫描二维码支付 ¥${selectedPlan.price} 元`;
    }
    
    // 更新支付后提示：联系方式
    const contactInfo = document.getElementById('qrcodeContactInfo');
    if (contactInfo) {
        let contactText = `付款备注「${selectedPlan.name}+手机号」`;
        if (CONFIG.CONTACT_WECHAT) contactText += `，然后加微信 <b>${CONFIG.CONTACT_WECHAT}</b> 发截图获取激活码`;
        contactInfo.innerHTML = contactText;
    }

    if (qrcodeModal) qrcodeModal.classList.add('active');
    
    qrcodeImage.onerror = () => {
        qrcodeImage.src = '';
        qrcodeImage.alt = '收款码图片缺失';
        qrcodeNote.innerText = `收款码图片缺失，请确保 images 文件夹下有 WeChatpay.png 和 Alipay.jpg`;
    };
}

// 激活码验证并开通会员
function activateWithCode(code) {
    if (!code || !code.trim()) {
        customAlert('请输入激活码');
        return;
    }
    
    const inputCode = code.trim().toUpperCase();
    
    // 检查激活码是否存在
    const codeInfo = CONFIG.ACTIVATION_CODES[inputCode];
    if (!codeInfo) {
        customAlert('激活码无效，请检查后重新输入');
        return;
    }
    
    // 检查激活码是否已被使用
    const usedCodes = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USED_CODES) || '[]');
    if (usedCodes.includes(inputCode)) {
        customAlert('该激活码已被使用，如有疑问请联系客服');
        return;
    }
    
    // 激活会员
    const isLifetime = codeInfo.days === -1;
    let expiryDate = null;
    if (isLifetime) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.PREMIUM, 'true');
        localStorage.setItem(CONFIG.STORAGE_KEYS.PREMIUM_EXPIRY, '2099-12-31T23:59:59.000Z');
        localStorage.setItem(CONFIG.STORAGE_KEYS.PREMIUM_PLAN, codeInfo.plan);
        appData.isPremium = true;
    } else {
        expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + codeInfo.days);
        localStorage.setItem(CONFIG.STORAGE_KEYS.PREMIUM, 'true');
        localStorage.setItem(CONFIG.STORAGE_KEYS.PREMIUM_EXPIRY, expiryDate.toISOString());
        localStorage.setItem(CONFIG.STORAGE_KEYS.PREMIUM_PLAN, codeInfo.plan);
        appData.isPremium = true;
    }

    // 标记激活码已使用
    usedCodes.push(inputCode);
    localStorage.setItem(CONFIG.STORAGE_KEYS.USED_CODES, JSON.stringify(usedCodes));

    // 新人卡特殊处理
    if (codeInfo.plan === 'newbie') {
        localStorage.setItem('wancheng_newbie_used', 'true');
    }

    // 关闭弹窗
    document.getElementById('qrcodeModal')?.classList.remove('active');
    document.getElementById('activationModal')?.classList.remove('active');

    updatePremiumUI();
    const expiryMsg = isLifetime ? '永久有效' : expiryDate.toLocaleDateString();
    customAlert(`🎉 激活成功！您已开通${codeInfo.name}，${expiryMsg}`, () => renderCurrentPage());
}

function completePayment() {
    // 此函数保留兼容，现已由激活码系统取代
    if (!selectedPlan) return;
    const isLifetime = selectedPlan.days === -1;
    let expiryDate = null;
    if (isLifetime) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.PREMIUM, 'true');
        localStorage.setItem(CONFIG.STORAGE_KEYS.PREMIUM_EXPIRY, '2099-12-31T23:59:59.000Z');
        localStorage.setItem(CONFIG.STORAGE_KEYS.PREMIUM_PLAN, selectedPlan.plan);
        appData.isPremium = true;
    } else {
        expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + selectedPlan.days);
        localStorage.setItem(CONFIG.STORAGE_KEYS.PREMIUM, 'true');
        localStorage.setItem(CONFIG.STORAGE_KEYS.PREMIUM_EXPIRY, expiryDate.toISOString());
        localStorage.setItem(CONFIG.STORAGE_KEYS.PREMIUM_PLAN, selectedPlan.plan);
        appData.isPremium = true;
    }
    if (selectedPlan.plan === 'newbie') {
        localStorage.setItem('wancheng_newbie_used', 'true');
    }
    const qrcodeModal = document.getElementById('qrcodeModal');
    if (qrcodeModal) qrcodeModal.classList.remove('active');
    updatePremiumUI();
    const expiryMsg = isLifetime ? '永久有效' : '，有效期至' + expiryDate.toLocaleDateString();
    customAlert(`支付成功！您已成为${selectedPlan.name}会员${expiryMsg}`, () => renderCurrentPage());
}

function updatePaymentUI() {
    // 此函数已被 premium.js 中的 updatePremiumUI() 取代，此处留空避免报错
}