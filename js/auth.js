// ==================== 认证相关函数 ====================

// 初始化认证
function initAuth() {
    const savedUser = localStorage.getItem(CONFIG.STORAGE_KEYS.CURRENT_USER);
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        loadUserData();
        showMainApp();
    } else {
        // 未登录时也加载数据（使用默认 key）
        loadUserData();
    }
}

// 显示主应用
function showMainApp() {
    const authContainer = document.getElementById('authContainer');
    const mainApp = document.getElementById('mainApp');
    if (authContainer) authContainer.style.display = 'none';
    if (mainApp) mainApp.classList.add('visible');
    loadUserData();
    // 如果当前在"我的"页面，刷新表单回显
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink?.dataset.page === 'my') renderMyPage();
    checkPremiumStatus();
    renderCurrentPage();
    bindMainEvents();
}

// 显示认证页面
function showAuthPage() {
    const authContainer = document.getElementById('authContainer');
    const mainApp = document.getElementById('mainApp');
    if (authContainer) authContainer.style.display = 'flex';
    if (mainApp) mainApp.classList.remove('visible');
}

// ==================== 游客登录 ====================

function enterGuestMode() {
    // 标记为游客模式（不写入 localStorage，仅内存标识）
    currentUser = null;
    window._isGuestMode = true;
    
    const authContainer = document.getElementById('authContainer');
    const mainApp = document.getElementById('mainApp');
    if (authContainer) authContainer.style.display = 'none';
    if (mainApp) mainApp.classList.add('visible');
    
    loadUserData();
    checkPremiumStatus();
    // 游客模式强制为非会员状态
    appData.isPremium = false;
    renderCurrentPage();
    bindMainEvents();
    
    // 顶部显示游客提示条
    showGuestBanner();
}

function showGuestBanner() {
    // 如果已有提示条则不重复添加
    if (document.getElementById('guestBanner')) return;
    const banner = document.createElement('div');
    banner.id = 'guestBanner';
    banner.className = 'guest-banner';
    banner.innerHTML = `
        <span>👤 当前为游客体验模式，数据不会保存。<a id="guestRegisterLink" href="javascript:void(0)">立即注册</a> 或 <a id="guestLoginLink" href="javascript:void(0)">登录</a> 解锁全部功能</span>
        <button class="guest-banner-close" id="closeguestBanner">✕</button>
    `;
    // 插在顶部导航栏之后
    const topNav = document.querySelector('.top-nav');
    if (topNav && topNav.parentNode) {
        topNav.parentNode.insertBefore(banner, topNav.nextSibling);
    } else {
        const mainApp = document.getElementById('mainApp');
        if (mainApp) mainApp.insertBefore(banner, mainApp.firstChild);
    }
    
    // 绑定事件
    document.getElementById('closeguestBanner')?.addEventListener('click', () => {
        banner.style.display = 'none';
    });
    document.getElementById('guestRegisterLink')?.addEventListener('click', () => {
        exitGuestMode('register');
    });
    document.getElementById('guestLoginLink')?.addEventListener('click', () => {
        exitGuestMode('login');
    });
}

function exitGuestMode(tab) {
    window._isGuestMode = false;
    const banner = document.getElementById('guestBanner');
    if (banner) banner.remove();
    showAuthPage();
    if (tab) switchToTab(tab);
}

// ==================== 登录处理 ====================

function handleLogin(account, password) {
    // 显示加载状态
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoading = loginBtn.querySelector('.btn-loading');
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    loginBtn.disabled = true;

    // 模拟网络请求延迟
    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USERS) || '[]');
        const user = users.find(u => u.phone === account && u.password === password);
        
        if (user) {
            // 登录成功动画
            loginBtn.classList.add('success');
            
            currentUser = user;
            localStorage.setItem(CONFIG.STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
            loadUserData();
            
            setTimeout(() => {
                showMainApp();
                customAlert('登录成功！欢迎回来，' + (user.nickname || user.nickname) + '！');
            }, 500);
        } else {
            // 恢复按钮状态
            btnText.style.display = 'inline-flex';
            btnLoading.style.display = 'none';
            loginBtn.disabled = false;
            
            // 显示错误
            showFieldError('loginAccount', '账号或密码错误');
            showFieldError('loginPassword', '请检查后重新输入');
            customAlert('账号或密码错误，请检查后重新输入');
        }
    }, 800);
}

// ==================== 注册处理 ====================

function handleRegister(nickname, phone, password, confirmPassword) {
    // 验证所有字段
    let isValid = true;
    
    // 验证昵称
    if (!nickname || nickname.length < 2 || nickname.length > 20) {
        showFieldError('regNickname', '昵称长度需在2-20个字符之间');
        isValid = false;
    } else {
        showFieldSuccess('regNickname', '');
    }
    
    // 验证手机号
    if (!phone.match(/^1[3-9]\d{9}$/)) {
        showFieldError('regPhone', '请输入正确的11位手机号');
        isValid = false;
    } else {
        showFieldSuccess('regPhone', '');
    }
    
    // 验证密码
    if (password.length < 6) {
        showFieldError('regPassword', '密码长度不能少于6位');
        isValid = false;
    } else {
        showFieldSuccess('regPassword', '');
    }
    
    // 验证确认密码
    if (password !== confirmPassword) {
        showFieldError('regConfirmPassword', '两次输入的密码不一致');
        isValid = false;
    } else if (!confirmPassword) {
        showFieldError('regConfirmPassword', '请再次输入密码');
        isValid = false;
    } else {
        showFieldSuccess('regConfirmPassword', '');
    }
    
    if (!isValid) {
        customAlert('请检查表单填写是否正确');
        return;
    }
    
    // 检查手机号是否已注册
    const users = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USERS) || '[]');
    if (users.find(u => u.phone === phone)) {
        showFieldError('regPhone', '该手机号已被注册');
        customAlert('该手机号已被注册，请直接登录或使用其他手机号');
        return;
    }
    
    // 显示加载状态
    const registerBtn = document.getElementById('registerBtn');
    const btnText = registerBtn.querySelector('.btn-text');
    const btnLoading = registerBtn.querySelector('.btn-loading');
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    registerBtn.disabled = true;
    
    // 创建新用户
    setTimeout(() => {
        const newUser = { 
            id: Date.now(), 
            nickname: nickname, 
            phone, 
            password, 
            avatar: '', 
            wechatOpenId: '', 
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
        currentUser = newUser;
        localStorage.setItem(CONFIG.STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
        // 注册时初始化存储，确保后续 loadUserData 能读到空的 userInfo
        saveUserData();
        
        registerBtn.classList.add('success');
        
        setTimeout(() => {
            showMainApp();
            customAlert('注册成功！欢迎加入碗秤铁记录本，' + nickname + '！');
        }, 500);
    }, 800);
}

// ==================== 忘记密码处理 ====================

function handleForgotPassword(phone, newPassword, confirmPassword) {
    // 验证手机号
    if (!phone.match(/^1[3-9]\d{9}$/)) {
        showFieldError('forgotPhone', '请输入正确的手机号');
        return;
    }
    
    // 验证新密码
    if (newPassword.length < 6) {
        showFieldError('forgotNewPassword', '密码长度不能少于6位');
        return;
    }
    
    // 验证确认密码
    if (newPassword !== confirmPassword) {
        showFieldError('forgotConfirmPassword', '两次输入的密码不一致');
        return;
    }
    
    // 查找用户
    const users = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USERS) || '[]');
    const userIndex = users.findIndex(u => u.phone === phone);
    
    if (userIndex === -1) {
        showFieldError('forgotPhone', '该手机号未注册');
        customAlert('该手机号未注册，请先注册');
        return;
    }
    
    // 更新密码
    users[userIndex].password = newPassword;
    localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
    
    customAlert('密码重置成功！请使用新密码登录', () => {
        switchToTab('login');
        clearForm('forgot');
    });
}

// ==================== 表单验证辅助函数 ====================

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const hint = document.getElementById(fieldId + 'Hint');
    
    if (field) {
        field.classList.remove('success');
        field.classList.add('error');
    }
    
    if (hint) {
        hint.textContent = message;
        hint.classList.remove('success');
        hint.classList.add('error');
    }
}

function showFieldSuccess(fieldId, message) {
    const field = document.getElementById(fieldId);
    const hint = document.getElementById(fieldId + 'Hint');
    
    if (field) {
        field.classList.remove('error');
        field.classList.add('success');
    }
    
    if (hint) {
        hint.textContent = message;
        hint.classList.remove('error');
        hint.classList.add('success');
    }
}

function clearFieldState(fieldId) {
    const field = document.getElementById(fieldId);
    const hint = document.getElementById(fieldId + 'Hint');
    
    if (field) {
        field.classList.remove('error', 'success');
    }
    
    if (hint) {
        hint.textContent = '';
        hint.classList.remove('error', 'success');
    }
}

function clearForm(type) {
    if (type === 'register' || type === 'all') {
        document.getElementById('regNickname').value = '';
        document.getElementById('regPhone').value = '';
        document.getElementById('regPassword').value = '';
        document.getElementById('regConfirmPassword').value = '';
        document.getElementById('agreeTerms').checked = false;
        clearFieldState('regNickname');
        clearFieldState('regPhone');
        clearFieldState('regPassword');
        clearFieldState('regConfirmPassword');
        updateRegisterBtnState();
        updatePasswordStrength('');
    }
    
    if (type === 'login' || type === 'all') {
        document.getElementById('loginAccount').value = '';
        document.getElementById('loginPassword').value = '';
        clearFieldState('loginAccount');
        clearFieldState('loginPassword');
    }
    
    if (type === 'forgot' || type === 'all') {
        document.getElementById('forgotPhone').value = '';
        document.getElementById('forgotNewPassword').value = '';
        document.getElementById('forgotConfirmPassword').value = '';
        clearFieldState('forgotPhone');
        clearFieldState('forgotNewPassword');
        clearFieldState('forgotConfirmPassword');
    }
}

// ==================== 密码强度检测 ====================

function updatePasswordStrength(password) {
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthFill || !strengthText) return;
    
    let strength = 0;
    let text = '请设置密码';
    let level = '';
    
    if (!password) {
        strengthFill.className = 'strength-fill';
        strengthText.className = 'strength-text';
        strengthText.textContent = text;
        return;
    }
    
    // 长度检查
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    
    // 复杂度检查
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    if (strength <= 2) {
        level = 'weak';
        text = '密码强度：弱';
    } else if (strength <= 4) {
        level = 'medium';
        text = '密码强度：中等';
    } else {
        level = 'strong';
        text = '密码强度：强';
    }
    
    strengthFill.className = 'strength-fill ' + level;
    strengthText.className = 'strength-text ' + level;
    strengthText.textContent = text;
}

// ==================== 注册按钮状态 ====================

function updateRegisterBtnState() {
    const nickname = document.getElementById('regNickname').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    const registerBtn = document.getElementById('registerBtn');
    
    const isFormValid = nickname.length >= 2 && 
                        phone.match(/^1[3-9]\d{9}$/) && 
                        password.length >= 6 && 
                        password === confirmPassword &&
                        agreeTerms;
    
    registerBtn.disabled = !isFormValid;
}

// ==================== Tab 切换 ====================

function switchToTab(tabName) {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(tab => {
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    forms.forEach(form => {
        if (form.id === tabName + 'Form') {
            form.classList.add('active');
        } else {
            form.classList.remove('active');
        }
    });
    
    // 清除当前表单状态
    clearForm('all');
}

// ==================== 密码显示/隐藏切换 ====================

function togglePasswordVisibility(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.textContent = '🙈';
    } else {
        input.type = 'password';
        toggle.textContent = '👁️';
    }
}

// ==================== 退出登录 ====================

function logout() {
    customConfirm('确定要退出登录吗？', (confirmed) => {
        if (confirmed) {
            localStorage.removeItem(CONFIG.STORAGE_KEYS.CURRENT_USER);
            currentUser = null;
            showAuthPage();
        }
    });
}

// ==================== 用户信息更新 ====================

function updateUserInfo(updates) {
    if (!currentUser) return false;
    Object.assign(currentUser, updates);
    const users = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USERS) || '[]');
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) users[idx] = { ...users[idx], ...updates };
    localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(CONFIG.STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    return true;
}

// ==================== 第三方绑定（保留但不显示） ====================

function bindWechat(openId) {
    if (!openId) { customAlert('请输入微信OpenID'); return false; }
    updateUserInfo({ wechatOpenId: openId, wechatBindTime: new Date().toISOString() });
    customAlert('微信绑定成功！');
    return true;
}

function changePassword(oldPwd, newPwd, confirmPwd) {
    if (!oldPwd || !newPwd || !confirmPwd) { customAlert('请填写完整信息'); return false; }
    if (currentUser?.password && oldPwd !== currentUser?.password) { customAlert('原密码错误'); return false; }
    if (newPwd !== confirmPwd) { customAlert('两次输入的新密码不一致'); return false; }
    if (newPwd.length < 6) { customAlert('新密码长度不能少于6位'); return false; }
    updateUserInfo({ password: newPwd });
    customAlert('密码修改成功，请重新登录', () => logout());
    return true;
}

function getBindStatus() { return { wechat: !!currentUser?.wechatOpenId }; }

function renderBindStatus() {
    const status = getBindStatus();
    const ws = document.getElementById('wechatStatus');
    const wst = document.getElementById('wechatStatusText');
    if (ws) { ws.innerText = status.wechat ? '已绑定' : '未绑定'; ws.style.color = status.wechat ? 'var(--primary)' : 'var(--text-secondary)'; }
    if (wst) { wst.innerText = status.wechat ? '已绑定' : '未绑定'; wst.style.color = status.wechat ? 'var(--success, #2ecc71)' : 'var(--text-secondary)'; }
}
