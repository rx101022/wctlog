function bindAuthEvents() {
    // Tab 切换
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.onclick = () => switchToTab(tab.dataset.tab);
    });
    
    // 登录按钮
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) loginBtn.onclick = () => {
        const account = document.getElementById('loginAccount')?.value || '';
        const password = document.getElementById('loginPassword')?.value || '';
        
        // 清除之前的错误状态
        clearFieldState('loginAccount');
        clearFieldState('loginPassword');
        
        if (!account) { 
            showFieldError('loginAccount', '请输入手机号');
            return; 
        }
        if (!password) { 
            showFieldError('loginPassword', '请输入密码');
            return; 
        }
        handleLogin(account, password);
    };
    
    // 登录表单 - 实时验证
    const loginAccountInput = document.getElementById('loginAccount');
    const loginPasswordInput = document.getElementById('loginPassword');
    if (loginAccountInput) {
        loginAccountInput.oninput = () => {
            if (loginAccountInput.value) clearFieldState('loginAccount');
        };
    }
    if (loginPasswordInput) {
        loginPasswordInput.oninput = () => {
            if (loginPasswordInput.value) clearFieldState('loginPassword');
        };
    }
    
    // 回车登录
    if (loginAccountInput) loginAccountInput.onkeydown = (e) => { if (e.key === 'Enter') loginBtn?.click(); };
    if (loginPasswordInput) loginPasswordInput.onkeydown = (e) => { if (e.key === 'Enter') loginBtn?.click(); };
    
    // 注册按钮
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) registerBtn.onclick = () => {
        const nickname = document.getElementById('regNickname')?.value || '';
        const phone = document.getElementById('regPhone')?.value || '';
        const password = document.getElementById('regPassword')?.value || '';
        const confirmPassword = document.getElementById('regConfirmPassword')?.value || '';
        handleRegister(nickname, phone, password, confirmPassword);
    };
    
    // 注册表单 - 实时验证
    const regNickname = document.getElementById('regNickname');
    const regPhone = document.getElementById('regPhone');
    const regPassword = document.getElementById('regPassword');
    const regConfirmPassword = document.getElementById('regConfirmPassword');
    const agreeTerms = document.getElementById('agreeTerms');
    
    if (regNickname) {
        regNickname.oninput = () => {
            const val = regNickname.value;
            if (val.length > 0 && val.length < 2) {
                showFieldError('regNickname', '昵称至少需要2个字符');
            } else if (val.length > 20) {
                showFieldError('regNickname', '昵称不能超过20个字符');
            } else {
                clearFieldState('regNickname');
            }
            updateRegisterBtnState();
        };
    }
    
    if (regPhone) {
        regPhone.oninput = (e) => {
            // 只允许数字
            e.target.value = e.target.value.replace(/\D/g, '');
            const val = regPhone.value;
            if (val.length > 0 && !val.match(/^1[3-9]\d{0,9}$/)) {
                showFieldError('regPhone', '请输入正确的手机号格式');
            } else {
                clearFieldState('regPhone');
            }
            updateRegisterBtnState();
        };
    }
    
    if (regPassword) {
        regPassword.oninput = () => {
            updatePasswordStrength(regPassword.value);
            if (regPassword.value.length > 0 && regPassword.value.length < 6) {
                showFieldError('regPassword', '密码长度不能少于6位');
            } else {
                clearFieldState('regPassword');
            }
            // 同时验证确认密码
            if (regConfirmPassword && regConfirmPassword.value && regConfirmPassword.value !== regPassword.value) {
                showFieldError('regConfirmPassword', '两次输入的密码不一致');
            } else {
                clearFieldState('regConfirmPassword');
            }
            updateRegisterBtnState();
        };
    }
    
    if (regConfirmPassword) {
        regConfirmPassword.oninput = () => {
            const val = regConfirmPassword.value;
            if (val && regPassword && val !== regPassword.value) {
                showFieldError('regConfirmPassword', '两次输入的密码不一致');
            } else if (val) {
                showFieldSuccess('regConfirmPassword', '密码一致');
            } else {
                clearFieldState('regConfirmPassword');
            }
            updateRegisterBtnState();
        };
    }
    
    if (agreeTerms) {
        agreeTerms.onchange = () => updateRegisterBtnState();
    }
    
    // 跳转到注册/登录按钮
    const goToRegisterBtn = document.getElementById('goToRegisterBtn');
    const goToLoginBtn = document.getElementById('goToLoginBtn');
    if (goToRegisterBtn) goToRegisterBtn.onclick = () => switchToTab('register');
    if (goToLoginBtn) goToLoginBtn.onclick = () => switchToTab('login');
    
    // 游客体验按钮
    const guestLoginBtn = document.getElementById('guestLoginBtn');
    if (guestLoginBtn) guestLoginBtn.onclick = () => enterGuestMode();
    
    // 忘记密码
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
    if (forgotPasswordBtn) forgotPasswordBtn.onclick = () => switchToTab('forgot');
    
    const backToLoginBtn = document.getElementById('backToLoginBtn');
    if (backToLoginBtn) backToLoginBtn.onclick = () => switchToTab('login');
    
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    if (resetPasswordBtn) {
        resetPasswordBtn.onclick = () => {
            const phone = document.getElementById('forgotPhone')?.value || '';
            const newPassword = document.getElementById('forgotNewPassword')?.value || '';
            const confirmPassword = document.getElementById('forgotConfirmPassword')?.value || '';
            handleForgotPassword(phone, newPassword, confirmPassword);
        };
    }
    
    // 忘记密码表单手机号输入限制
    const forgotPhone = document.getElementById('forgotPhone');
    if (forgotPhone) {
        forgotPhone.oninput = (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        };
    }
    
    // 密码可见性切换
    const toggleBtns = [
        { toggle: 'toggleLoginPassword', input: 'loginPassword' },
        { toggle: 'toggleRegPassword', input: 'regPassword' },
        { toggle: 'toggleRegConfirmPassword', input: 'regConfirmPassword' },
        { toggle: 'toggleForgotPassword', input: 'forgotNewPassword' },
        { toggle: 'toggleForgotConfirmPassword', input: 'forgotConfirmPassword' }
    ];
    
    toggleBtns.forEach(({ toggle, input }) => {
        const btn = document.getElementById(toggle);
        if (btn) {
            btn.onclick = () => togglePasswordVisibility(input, toggle);
        }
    });
}

function bindMainEvents() {
    // 顶部导航栏（PC端）
    document.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = () => {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(`${link.dataset.page}Page`).classList.add('active');
            renderCurrentPage();
        };
    });

    // 移动端底部导航栏
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
        item.onclick = () => {
            const pageName = item.dataset.page;
            // 更新底部导航高亮
            document.querySelectorAll('.mobile-nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            // 更新顶部导航高亮（如果有）
            document.querySelectorAll('.nav-link').forEach(l => {
                l.classList.toggle('active', l.dataset.page === pageName);
            });
            // 切换页面显示
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(`${pageName}Page`).classList.add('active');
            renderCurrentPage();
        };
    });
    
    const prevDay = document.getElementById('prevDay');
    const nextDay = document.getElementById('nextDay');
    if (prevDay) prevDay.onclick = () => { const date = new Date(appData.currentDate); date.setDate(date.getDate() - 1); appData.currentDate = date.toISOString().slice(0, 10); renderDietPage(); };
    if (nextDay) nextDay.onclick = () => { const date = new Date(appData.currentDate); date.setDate(date.getDate() + 1); if (date <= new Date()) { appData.currentDate = date.toISOString().slice(0, 10); renderDietPage(); } };
    
    // 昵称、性别、身高改动时自动保存（blur + change 双重保障，防止直接刷新页面丢失数据）
    // 注意：无论 saveProfileBtn 是否存在，都应该绑定事件
    ['nickname', 'gender', 'height'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.onchange = autoSaveProfile;
            el.onblur = autoSaveProfile;  // 失去焦点时也保存
        }
    });

    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn) {
        saveProfileBtn.onclick = autoSaveProfile;
    }

    // 自动保存个人信息（供 onchange / onblur / 按钮点击调用）
    function autoSaveProfile() {
        if (!appData || !currentUser) return;
        const nickname = document.getElementById('nickname')?.value || '';
        const gender = document.getElementById('gender')?.value || '';
        const height = document.getElementById('height')?.value || '';
        appData.userInfo = {
            nickname,
            gender,
            height,
            avatar: appData.userInfo?.avatar || ''
        };
        saveUserData();
        // 同步到 currentUser，确保重新登录后性别身高也正确
        if (currentUser) updateUserInfo({ nickname, gender, height });
        if (event && event.type === 'click') customAlert('保存成功');
    }
    
    const avatarBtn = document.getElementById('avatarBtn');
    if (avatarBtn) avatarBtn.onclick = () => { const myLink = document.querySelector('.nav-link[data-page="my"]'); if (myLink) myLink.click(); };
    
    const membershipBadge = document.getElementById('membershipBadge');
    const closeVipModal = document.getElementById('closeVipModal');
    const vipModal = document.getElementById('vipModal');
    if (membershipBadge) membershipBadge.onclick = () => vipModal?.classList.add('active');
    if (closeVipModal) closeVipModal.onclick = () => vipModal?.classList.remove('active');
    
    document.querySelectorAll('.plan-card').forEach(card => { card.onclick = (e) => { e.stopPropagation(); const plan = card.dataset.plan; processPayment(plan); }; });
    
    const wechatPayBtn = document.getElementById('wechatPayBtn');
    const alipayBtn = document.getElementById('alipayBtn');
    const closePaymentMethodModal = document.getElementById('closePaymentMethodModal');
    const paymentMethodModal = document.getElementById('paymentMethodModal');
    const closeQrcodeModal = document.getElementById('closeQrcodeModal');
    const qrcodeModal = document.getElementById('qrcodeModal');
    if (wechatPayBtn) wechatPayBtn.onclick = () => showQrcode('wechat');
    if (alipayBtn) alipayBtn.onclick = () => showQrcode('alipay');
    if (closePaymentMethodModal) closePaymentMethodModal.onclick = () => paymentMethodModal?.classList.remove('active');
    if (closeQrcodeModal) closeQrcodeModal.onclick = () => qrcodeModal?.classList.remove('active');

    // 激活码弹窗
    const activationModal = document.getElementById('activationModal');
    const openActivationBtn = document.getElementById('openActivationBtn');
    const closeActivationModal = document.getElementById('closeActivationModal');
    const confirmActivationBtn = document.getElementById('confirmActivationBtn');
    const activationCodeInput = document.getElementById('activationCodeInput');
    if (openActivationBtn) openActivationBtn.onclick = () => {
        qrcodeModal?.classList.remove('active');
        activationModal?.classList.add('active');
    };
    if (closeActivationModal) closeActivationModal.onclick = () => activationModal?.classList.remove('active');
    if (confirmActivationBtn) confirmActivationBtn.onclick = () => {
        activateWithCode(activationCodeInput?.value || '');
    };
    // 回车确认
    if (activationCodeInput) activationCodeInput.onkeydown = (e) => { if (e.key === 'Enter') confirmActivationBtn?.click(); };
    if (activationModal) activationModal.onclick = (e) => { if (e.target === activationModal) activationModal.classList.remove('active'); };
    
    const addWeightBtn = document.getElementById('addWeightBtn');
    if (addWeightBtn) addWeightBtn.onclick = () => { customNumber('记录体重', '请输入体重（kg）', '体重', (weight) => { if (weight && !isNaN(weight) && parseFloat(weight) > 0 && parseFloat(weight) < 300) { appData.weightRecords.push({ date: new Date().toISOString().slice(0, 10), weight: parseFloat(weight) }); saveUserData(); renderMyPage(); if (typeof renderWeightAnalysis === 'function') renderWeightAnalysis(); customAlert('体重记录成功！'); } else if (weight) { customAlert('请输入有效的体重（1-300kg）'); } }); };
    
    const exportDataBtn = document.getElementById('exportDataBtn');
    if (exportDataBtn) exportDataBtn.onclick = () => { const dataStr = JSON.stringify(appData, null, 2); const blob = new Blob([dataStr], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `wancheng_data_${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url); customAlert('数据已导出'); };
    
    const clearDataBtn = document.getElementById('clearDataBtn');
    if (clearDataBtn) clearDataBtn.onclick = () => { customConfirm('确定清除所有数据吗？不可恢复！', (confirmed) => { if (confirmed) { appData.dietRecords = []; appData.trainingRecords = []; appData.weightRecords = []; appData.userInfo = { nickname: '', gender: '', height: '', avatar: '' }; saveUserData(); renderCurrentPage(); customAlert('数据已清除'); } }); };
    
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) deleteAccountBtn.onclick = () => { customConfirm('确定要注销账号吗？所有数据将被永久删除，不可恢复！', (confirmed) => { if (confirmed) { localStorage.removeItem('wancheng_user_data'); localStorage.removeItem('wancheng_logged_in'); appData = JSON.parse(JSON.stringify(defaultAppData)); showLogin(); customAlert('账号已注销'); } }); };
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.onclick = () => {
        if (window._isGuestMode) {
            // 游客模式：直接退出回登录页
            customConfirm('确定要退出游客模式吗？', (confirmed) => {
                if (confirmed) {
                    window._isGuestMode = false;
                    const banner = document.getElementById('guestBanner');
                    if (banner) banner.remove();
                    showAuthPage();
                }
            });
        } else {
            logout();
        }
    };
    
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarUploadWrapper = document.getElementById('avatarUploadWrapper');
    const avatarFileInput = document.getElementById('avatarFileInput');
    const resetAvatarBtn = document.getElementById('resetAvatarBtn');
    
    // 点击头像区域触发文件选择
    if (avatarUploadWrapper) {
        avatarUploadWrapper.onclick = () => avatarFileInput?.click();
    }
    if (changeAvatarBtn) {
        changeAvatarBtn.onclick = () => avatarFileInput?.click();
    }
    
    // 文件选择后处理
    if (avatarFileInput) {
        avatarFileInput.onchange = (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            
            // 验证文件类型
            if (!file.type.startsWith('image/')) {
                customAlert('请选择图片文件');
                avatarFileInput.value = '';
                return;
            }
            
            // 验证文件大小（限制2MB）
            if (file.size > 2 * 1024 * 1024) {
                customAlert('图片大小不能超过2MB');
                avatarFileInput.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target?.result;
                if (dataUrl) {
                    // 更新头像显示
                    const ua = document.getElementById('userAvatar');
                    const al = document.getElementById('avatarLarge');
                    if (ua) ua.src = dataUrl;
                    if (al) al.src = dataUrl;
                    
                    // 保存到用户数据
                    if (appData) {
                        appData.userInfo.avatar = dataUrl;
                        saveUserData();
                    }
                    
                    // 如果是已登录用户，也更新 currentUser
                    if (currentUser) {
                        currentUser.avatar = dataUrl;
                        const users = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USERS) || '[]');
                        const idx = users.findIndex(u => u.id === currentUser.id);
                        if (idx !== -1) {
                            users[idx].avatar = dataUrl;
                            localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
                            localStorage.setItem(CONFIG.STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
                        }
                    }
                    
                    customAlert('头像已更新！');
                }
            };
            reader.readAsDataURL(file);
            avatarFileInput.value = ''; // 重置input，允许重复选择同一文件
        };
    }
    
    // 恢复默认头像
    if (resetAvatarBtn) {
        resetAvatarBtn.onclick = () => {
            customConfirm('确定要恢复默认头像吗？', (confirmed) => {
                if (confirmed) {
                    const defaultAvatar = 'images/default-avatar.png';
                    const ua = document.getElementById('userAvatar');
                    const al = document.getElementById('avatarLarge');
                    if (ua) ua.src = defaultAvatar;
                    if (al) al.src = defaultAvatar;
                    
                    if (appData) {
                        appData.userInfo.avatar = '';
                        saveUserData();
                    }
                    
                    if (currentUser) {
                        currentUser.avatar = '';
                        const users = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USERS) || '[]');
                        const idx = users.findIndex(u => u.id === currentUser.id);
                        if (idx !== -1) {
                            users[idx].avatar = '';
                            localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
                            localStorage.setItem(CONFIG.STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
                        }
                    }
                    
                    customAlert('已恢复默认头像');
                }
            });
        };
    }
    
    // 账户设置事件
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const changePasswordModal = document.getElementById('changePasswordModal');
    const closeChangePasswordModal = document.getElementById('closeChangePasswordModal');
    const confirmChangePasswordBtn = document.getElementById('confirmChangePasswordBtn');
    if (changePasswordBtn) changePasswordBtn.onclick = () => changePasswordModal?.classList.add('active');
    if (closeChangePasswordModal) closeChangePasswordModal.onclick = () => { changePasswordModal?.classList.remove('active'); document.getElementById('oldPassword').value = ''; document.getElementById('newPassword').value = ''; document.getElementById('confirmNewPassword').value = ''; };
    if (confirmChangePasswordBtn) confirmChangePasswordBtn.onclick = () => { const oldPwd = document.getElementById('oldPassword')?.value || ''; const newPwd = document.getElementById('newPassword')?.value || ''; const confirmPwd = document.getElementById('confirmNewPassword')?.value || ''; changePassword(oldPwd, newPwd, confirmPwd); if (confirmPwd) { changePasswordModal?.classList.remove('active'); document.getElementById('oldPassword').value = ''; document.getElementById('newPassword').value = ''; document.getElementById('confirmNewPassword').value = ''; } };
    
    const bindWechatBtn = document.getElementById('bindWechatBtn');
    const bindWechatModal = document.getElementById('bindWechatModal');
    const closeBindWechatModal = document.getElementById('closeBindWechatModal');
    const confirmBindWechatBtn = document.getElementById('confirmBindWechatBtn');
    if (bindWechatBtn) bindWechatBtn.onclick = () => bindWechatModal?.classList.add('active');
    if (closeBindWechatModal) closeBindWechatModal.onclick = () => { bindWechatModal?.classList.remove('active'); document.getElementById('wechatOpenId').value = ''; };
    if (confirmBindWechatBtn) confirmBindWechatBtn.onclick = () => { const openId = document.getElementById('wechatOpenId')?.value || ''; bindWechat(openId); bindWechatModal?.classList.remove('active'); renderBindStatus(); document.getElementById('wechatOpenId').value = ''; };
    
    // 训练报告导出（周报）- 会员专属
    const exportWeeklyReportBtn = document.getElementById('exportWeeklyReportBtn');
    if (exportWeeklyReportBtn) {
        exportWeeklyReportBtn.onclick = () => {
            if (!appData.isPremium) {
                customConfirm('训练报告导出为碗秤铁PRO专属功能，升级即可使用！', (confirmed) => {
                    if (confirmed) {
                        const vipModal = document.getElementById('vipModal');
                        if (vipModal) vipModal.classList.add('active');
                    }
                });
            } else {
                exportTrainingReport('weekly');
            }
        };
    }
    
    // 训练报告导出（月报）- 会员专属
    const exportMonthlyReportBtn = document.getElementById('exportMonthlyReportBtn');
    if (exportMonthlyReportBtn) {
        exportMonthlyReportBtn.onclick = () => {
            if (!appData.isPremium) {
                customConfirm('训练报告导出为碗秤铁PRO专属功能，升级即可使用！', (confirmed) => {
                    if (confirmed) {
                        const vipModal = document.getElementById('vipModal');
                        if (vipModal) vipModal.classList.add('active');
                    }
                });
            } else {
                exportTrainingReport('monthly');
            }
        };
    }
    
    // AI食物识别（免费功能）
    const aiFoodRecognitionBtn = document.getElementById('aiFoodRecognitionBtn');
    if (aiFoodRecognitionBtn) {
        aiFoodRecognitionBtn.onclick = () => {
            if (typeof startAIFoodRecognition === 'function') {
                startAIFoodRecognition();
            }
        };
    }
    
    // 饮食分析卡片点击
    const dietAnalysisCard = document.getElementById('dietAnalysisCard');
    if (dietAnalysisCard) {
        dietAnalysisCard.onclick = () => {
            if (!appData.isPremium) {
                customConfirm('饮食分析为碗秤铁PRO专属功能，升级即可使用！', (confirmed) => {
                    if (confirmed) {
                        const vipModal = document.getElementById('vipModal');
                        if (vipModal) vipModal.classList.add('active');
                    }
                });
            } else {
                renderDietAnalysis();
            }
        };
    }
    if (vipModal) vipModal.onclick = (e) => { if (e.target === vipModal) vipModal.classList.remove('active'); };
    if (paymentMethodModal) paymentMethodModal.onclick = (e) => { if (e.target === paymentMethodModal) paymentMethodModal.classList.remove('active'); };
    if (qrcodeModal) qrcodeModal.onclick = (e) => { if (e.target === qrcodeModal) qrcodeModal.classList.remove('active'); };
    if (changePasswordModal) changePasswordModal.onclick = (e) => { if (e.target === changePasswordModal) { changePasswordModal.classList.remove('active'); document.getElementById('oldPassword').value = ''; document.getElementById('newPassword').value = ''; document.getElementById('confirmNewPassword').value = ''; } };
    if (bindWechatModal) bindWechatModal.onclick = (e) => { if (e.target === bindWechatModal) { bindWechatModal.classList.remove('active'); document.getElementById('wechatOpenId').value = ''; } };
}
