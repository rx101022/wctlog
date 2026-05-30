function renderCurrentPage() {
    const activeLink = document.querySelector('.nav-link.active');
    if (!activeLink) return;
    const activePage = activeLink.dataset.page;
    if (activePage === 'diet') renderDietPage();
    if (activePage === 'motion') renderMotionPage();
    if (activePage === 'record') renderRecordPage();
    if (activePage === 'my') renderMyPage();
}

function renderDietPage() {
    const date = new Date(appData.currentDate);
    const dateDisplay = document.getElementById('dateDisplay');
    if (dateDisplay) dateDisplay.innerText = `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`;
    
    const todayRecord = appData.dietRecords.find(r => r.date === appData.currentDate);
    let totalCalories = 0;
    
    const meals = ['breakfast', 'lunch', 'dinner', 'snack'];
    const mealNames = ['早餐', '午餐', '晚餐', '加餐'];
    const mealIcons = ['🌅', '☀️', '🌙', '🍎'];
    
    let html = '';
    for (let i = 0; i < meals.length; i++) {
        const mealData = todayRecord?.meals?.find(m => m.type === meals[i]) || { foods: [], calories: 0 };
        totalCalories += mealData.calories;
        
        html += `
            <div class="meal-card">
                <div class="meal-header">
                    <span class="meal-name">${mealIcons[i]} ${mealNames[i]}</span>
                    <span class="meal-calories">${mealData.calories} 千卡</span>
                </div>
                <div>
                    ${mealData.foods.map((food, foodIdx) => `
                        <div class="food-item" style="display: flex; align-items: center; gap: 8px;">
                            <span class="food-name" style="flex: 1;">${food.name}</span>
                            <span class="food-calories">${food.calories} 千卡</span>
                            <span class="food-macros" style="font-size: 12px; color: var(--text-secondary);">
                                蛋白${food.protein || 0}g | 碳水${food.carbs || 0}g | 脂肪${food.fat || 0}g
                            </span>
                            <button class="food-edit-btn" data-meal="${meals[i]}" data-idx="${foodIdx}" title="编辑" style="background:none;border:none;cursor:pointer;font-size:16px;padding:2px 6px;color:var(--text-secondary);">✏️</button>
                            <button class="food-del-btn" data-meal="${meals[i]}" data-idx="${foodIdx}" title="删除" style="background:none;border:none;cursor:pointer;font-size:16px;padding:2px 6px;color:var(--danger,#e74c3c);">🗑️</button>
                        </div>
                    `).join('') || '<div style="padding: 12px 0; color: var(--text-secondary); text-align: center;">暂无记录</div>'}
                </div>
                <button class="add-food-btn" data-meal="${meals[i]}">+ 添加食物</button>
            </div>
        `;
    }
    
    const mealsGrid = document.getElementById('mealsGrid');
    if (mealsGrid) mealsGrid.innerHTML = html;
    
    const totalCaloriesEl = document.getElementById('totalCalories');
    const remainingCaloriesEl = document.getElementById('remainingCalories');
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    
    if (totalCaloriesEl) totalCaloriesEl.innerText = totalCalories;
    if (remainingCaloriesEl) remainingCaloriesEl.innerText = Math.max(0, 2000 - totalCalories);
    
    const percent = Math.min(100, (totalCalories / 2000) * 100);
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressPercent) progressPercent.innerText = `${Math.round(percent)}%`;
    
    // 绑定添加食物按钮（只选择mealsGrid内的按钮，排除AI识别按钮）
    if (mealsGrid) {
        mealsGrid.querySelectorAll('.add-food-btn:not(#aiFoodRecognitionBtn)').forEach(btn => {
            btn.onclick = () => addFood(btn.dataset.meal);
        });
    }

    document.querySelectorAll('.food-del-btn').forEach(btn => {
        btn.onclick = () => deleteFood(btn.dataset.meal, parseInt(btn.dataset.idx));
    });

    document.querySelectorAll('.food-edit-btn').forEach(btn => {
        btn.onclick = () => editFood(btn.dataset.meal, parseInt(btn.dataset.idx));
    });
}

function addFood(mealType) {
    // 饮食记录无会员限制

    const mealNames = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', snack: '加餐' };
    const mealIcons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };

    // 创建一步到位的添加食物弹窗
    const modalHtml = `
        <div id="addFoodModal" class="modal active">
            <div class="modal-content" style="max-width: 420px;">
                <div class="modal-header">
                    <h3>${mealIcons[mealType]} 添加食物</h3>
                    <span class="modal-close" onclick="document.getElementById('addFoodModal')?.remove()">✕</span>
                </div>
                <div style="padding: 16px; display: flex; flex-direction: column; gap: 14px;">
                    <div>
                        <label style="font-size: 13px; color: var(--text-secondary); display: block; margin-bottom: 6px;">食物名称</label>
                        <input id="addFoodName" type="text" placeholder="例如：米饭、苹果、鸡胸肉" style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--input-bg); color: var(--text-primary); font-size: 15px; box-sizing: border-box;">
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div>
                            <label style="font-size: 13px; color: var(--text-secondary); display: block; margin-bottom: 6px;">🔥 热量 (千卡)</label>
                            <input id="addFoodCal" type="number" placeholder="热量" min="0" style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--input-bg); color: var(--text-primary); font-size: 15px; box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="font-size: 13px; color: var(--text-secondary); display: block; margin-bottom: 6px;">💪 蛋白质 (g)</label>
                            <input id="addFoodProtein" type="number" placeholder="蛋白质" min="0" step="0.1" style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--input-bg); color: var(--text-primary); font-size: 15px; box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="font-size: 13px; color: var(--text-secondary); display: block; margin-bottom: 6px;">🍚 碳水 (g)</label>
                            <input id="addFoodCarbs" type="number" placeholder="碳水" min="0" step="0.1" style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--input-bg); color: var(--text-primary); font-size: 15px; box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="font-size: 13px; color: var(--text-secondary); display: block; margin-bottom: 6px;">🥑 脂肪 (g)</label>
                            <input id="addFoodFat" type="number" placeholder="脂肪" min="0" step="0.1" style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--input-bg); color: var(--text-primary); font-size: 15px; box-sizing: border-box;">
                        </div>
                    </div>
                    <button id="addFoodSaveBtn" style="width: 100%; padding: 14px; background: var(--primary); color: #fff; border: none; border-radius: 10px; cursor: pointer; font-size: 16px; font-weight: 600;">添加</button>
                </div>
            </div>
        </div>
    `;

    // 移除旧弹窗
    const oldModal = document.getElementById('addFoodModal');
    if (oldModal) oldModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('addFoodSaveBtn').onclick = () => {
        const foodName = document.getElementById('addFoodName').value.trim();
        const calories = parseFloat(document.getElementById('addFoodCal').value) || 0;
        const protein = parseFloat(document.getElementById('addFoodProtein').value) || 0;
        const carbs = parseFloat(document.getElementById('addFoodCarbs').value) || 0;
        const fat = parseFloat(document.getElementById('addFoodFat').value) || 0;

        if (!foodName) {
            customAlert('请输入食物名称');
            return;
        }
        if (calories <= 0) {
            customAlert('请输入热量');
            return;
        }

        // 保存数据
        let todayRecord = appData.dietRecords.find(r => r.date === appData.currentDate);
        if (!todayRecord) {
            todayRecord = { date: appData.currentDate, meals: [] };
            appData.dietRecords.push(todayRecord);
        }

        let meal = todayRecord.meals.find(m => m.type === mealType);
        if (!meal) {
            meal = { type: mealType, name: mealNames[mealType], foods: [], calories: 0 };
            todayRecord.meals.push(meal);
        }

        meal.foods.push({
            id: Date.now(),
            name: foodName,
            calories: calories,
            protein: protein,
            carbs: carbs,
            fat: fat
        });
        meal.calories += calories;

        saveUserData();
        renderDietPage();
        if (typeof renderDietAnalysis === 'function') renderDietAnalysis();

        const modal = document.getElementById('addFoodModal');
        if (modal) modal.remove();

        customAlert('已添加到' + mealNames[mealType] + '！');
    };

    // 点击遮罩关闭
    const modal = document.getElementById('addFoodModal');
    if (modal) {
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }

    // 自动聚焦到食物名称输入框
    setTimeout(() => {
        const nameInput = document.getElementById('addFoodName');
        if (nameInput) nameInput.focus();
    }, 100);
}

function renderMotionPage() {
    let activeCategory = 'all';
    let searchKeyword = '';
    
    function filterMotions() {
        let filtered = [...motionData.motions];
        if (activeCategory !== 'all') filtered = filtered.filter(m => m.category === activeCategory);
        if (searchKeyword) filtered = filtered.filter(m => m.name.toLowerCase().includes(searchKeyword.toLowerCase()));
        return filtered;
    }
    
    function renderSidebar() {
        const html = motionData.categories.map(cat => `<div class="category-item ${activeCategory === cat.key ? 'active' : ''}" data-category="${cat.key}">${cat.name}</div>`).join('');
        const sidebar = document.getElementById('categorySidebar');
        if (sidebar) sidebar.innerHTML = html;
        document.querySelectorAll('.category-item').forEach(item => {
            item.onclick = () => { activeCategory = item.dataset.category; renderSidebar(); renderMotions(); };
        });
    }
    
    function renderMotions() {
        const motions = filterMotions();
        const html = motions.map(m => `
            <div class="motion-card" data-id="${m.id}" data-video-url="${m.videoUrl}" data-name="${m.name}" data-duration="${m.duration}" data-difficulty="${m.difficulty}" data-cover="${m.cover}" data-muscles="${m.muscles || ''}" data-tips="${m.tips || ''}">
                <div class="motion-cover-wrap">
                    <div class="motion-play-icon">▶</div>
                    <div class="motion-card-title">${m.name}</div>
                </div>
            </div>
        `).join('');
        const motionGrid = document.getElementById('motionGrid');
        if (motionGrid) motionGrid.innerHTML = html || '<div style="text-align: center; padding: 40px;">暂无动作</div>';

        // 绑定点击事件
        document.querySelectorAll('.motion-card').forEach(card => {
            // 点击打开大窗口播放
            card.onclick = () => {
                const videoUrl = card.dataset.videoUrl;
                const name = card.dataset.name;
                const duration = card.dataset.duration;
                const difficulty = card.dataset.difficulty;
                const cover = card.dataset.cover;
                const muscles = card.dataset.muscles;
                const tips = card.dataset.tips;
                showVideoPlayer(videoUrl, name, duration, difficulty, cover, muscles, tips);
            };
        });
    }
    
    renderSidebar();
    renderMotions();
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.oninput = (e) => { searchKeyword = e.target.value; renderMotions(); };
}

// =================== 食物删除 ===================

function deleteFood(mealType, foodIdx) {
    customConfirm('确认删除该食物？', (confirmed) => {
        if (!confirmed) return;

        let todayRecord = appData.dietRecords.find(r => r.date === appData.currentDate);
        if (!todayRecord) return;
        let meal = todayRecord.meals.find(m => m.type === mealType);
        if (!meal || !meal.foods[foodIdx]) return;

        const food = meal.foods[foodIdx];
        meal.calories -= (food.calories || 0);
        meal.foods.splice(foodIdx, 1);

        saveUserData();
        renderDietPage();
        if (typeof renderDietAnalysis === 'function') renderDietAnalysis();
    });
}

// =================== 食物编辑弹窗 ===================

function editFood(mealType, foodIdx) {
    let todayRecord = appData.dietRecords.find(r => r.date === appData.currentDate);
    if (!todayRecord) return;
    let meal = todayRecord.meals.find(m => m.type === mealType);
    if (!meal || !meal.foods[foodIdx]) return;

    const food = meal.foods[foodIdx];
    const mealNames = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', snack: '加餐' };

    const modalHtml = `
        <div id="editFoodModal" class="modal active">
            <div class="modal-content" style="max-width: 400px;">
                <div class="modal-header">
                    <h3>编辑食物</h3>
                    <span class="modal-close" onclick="document.getElementById('editFoodModal')?.remove()">✕</span>
                </div>
                <div style="padding: 16px; display: flex; flex-direction: column; gap: 12px;">
                    <div style="font-size: 13px; color: var(--text-secondary);">${mealNames[mealType] || mealType}</div>
                    <div>
                        <label style="font-size: 13px; color: var(--text-secondary); display: block; margin-bottom: 4px;">食物名称</label>
                        <input id="editFoodName" type="text" value="${food.name}" style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 8px; background: var(--input-bg); color: var(--text-primary); box-sizing: border-box;">
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div>
                            <label style="font-size: 13px; color: var(--text-secondary); display: block; margin-bottom: 4px;">热量 (千卡)</label>
                            <input id="editFoodCal" type="number" value="${food.calories || 0}" min="0" style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 8px; background: var(--input-bg); color: var(--text-primary); box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="font-size: 13px; color: var(--text-secondary); display: block; margin-bottom: 4px;">蛋白质 (g)</label>
                            <input id="editFoodProtein" type="number" value="${food.protein || 0}" min="0" step="0.1" style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 8px; background: var(--input-bg); color: var(--text-primary); box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="font-size: 13px; color: var(--text-secondary); display: block; margin-bottom: 4px;">碳水 (g)</label>
                            <input id="editFoodCarbs" type="number" value="${food.carbs || 0}" min="0" step="0.1" style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 8px; background: var(--input-bg); color: var(--text-primary); box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="font-size: 13px; color: var(--text-secondary); display: block; margin-bottom: 4px;">脂肪 (g)</label>
                            <input id="editFoodFat" type="number" value="${food.fat || 0}" min="0" step="0.1" style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 8px; background: var(--input-bg); color: var(--text-primary); box-sizing: border-box;">
                        </div>
                    </div>
                    <button id="editFoodSaveBtn" style="width: 100%; padding: 12px; background: var(--primary); color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 15px;">保存修改</button>
                </div>
            </div>
        </div>
    `;

    // 移除旧弹窗
    const oldModal = document.getElementById('editFoodModal');
    if (oldModal) oldModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('editFoodSaveBtn').onclick = () => {
        const newName = document.getElementById('editFoodName').value.trim();
        const newCal = parseFloat(document.getElementById('editFoodCal').value) || 0;
        const newProtein = parseFloat(document.getElementById('editFoodProtein').value) || 0;
        const newCarbs = parseFloat(document.getElementById('editFoodCarbs').value) || 0;
        const newFat = parseFloat(document.getElementById('editFoodFat').value) || 0;

        if (!newName) return;

        // 更新该食物数据
        meal.foods[foodIdx] = {
            ...food,
            name: newName,
            calories: newCal,
            protein: newProtein,
            carbs: newCarbs,
            fat: newFat
        };

        // 重新计算该餐总热量
        meal.calories = meal.foods.reduce((sum, f) => sum + (f.calories || 0), 0);

        saveUserData();
        renderDietPage();
        if (typeof renderDietAnalysis === 'function') renderDietAnalysis();

        const modal = document.getElementById('editFoodModal');
        if (modal) modal.remove();
    };

    // 点击遮罩关闭
    const modal = document.getElementById('editFoodModal');
    if (modal) {
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    }
}
// 视频播放器
let videoModal = null;

function showVideoPlayer(videoUrl, name, duration, difficulty, cover, muscles, tips) {
    if (videoModal) {
        videoModal.remove();
        videoModal = null;
    }

    // 判断是否为B站视频链接
    const isBilibili = videoUrl && videoUrl.includes('bilibili');

    videoModal = document.createElement('div');
    videoModal.className = 'modal';
    videoModal.style.display = 'flex';

    let videoHtml = '';
    if (isBilibili) {
        // B站视频：提取 bvid 并生成带 autoplay 的播放器链接
        const bvidMatch = videoUrl.match(/BV[\w]+/);
        let embedUrl = videoUrl;
        if (bvidMatch) {
            embedUrl = `https://player.bilibili.com/player.html?bvid=${bvidMatch[0]}&page=1&autoplay=1`;
        }
        videoHtml = `<iframe src="${embedUrl}" width="100%" height="450" frameborder="0" allowfullscreen="true" allow="autoplay; fullscreen"></iframe>`;
    } else {
        // 普通视频：使用 video 标签，支持自动播放
        videoHtml = `
            <video controls autoplay class="video-player" playsinline>
                <source src="${videoUrl}" type="video/mp4">
                您的浏览器不支持视频播放
            </video>
        `;
    }

    // 动作信息区（肌群 + 要领）
    const infoHtml = (muscles || tips) ? `
        <div class="video-info">
            ${muscles ? `
            <div class="video-info-row">
                <span class="video-info-label">💪 锻炼肌群</span>
                <span class="video-info-value">${muscles}</span>
            </div>` : ''}
            ${tips ? `
            <div class="video-info-row">
                <span class="video-info-label">📌 动作要领</span>
                <span class="video-info-value">${tips}</span>
            </div>` : ''}
        </div>
    ` : '';

    videoModal.innerHTML = `
        <div class="video-modal-content">
            <div class="video-modal-header">
                <h3>${name}</h3>
                <span class="video-modal-close">&times;</span>
            </div>
            <div class="video-container">
                ${videoHtml}
            </div>
            ${infoHtml}
        </div>
    `;
    document.body.appendChild(videoModal);

    // 关闭按钮事件
    const closeBtn = videoModal.querySelector('.video-modal-close');
    closeBtn.onclick = () => {
        videoModal.remove();
        videoModal = null;
    };

    // 点击背景关闭
    videoModal.onclick = (e) => {
        if (e.target === videoModal) {
            videoModal.remove();
            videoModal = null;
        }
    };
}

// 训练记录页面 - 日历视图
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth() + 1;
let selectedDate = new Date().toISOString().slice(0, 10);

function renderRecordPage() {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekdaysDiv = document.getElementById('weekdays');
    if (weekdaysDiv) weekdaysDiv.innerHTML = weekdays.map(d => `<div>${d}</div>`).join('');
    
    function renderCalendar() {
        const firstDay = new Date(currentYear, currentMonth - 1, 1);
        const lastDay = new Date(currentYear, currentMonth, 0);
        const daysCount = lastDay.getDate();
        const startWeekday = firstDay.getDay();
        let html = '';
        for (let i = 0; i < startWeekday; i++) html += '<div class="calendar-day"></div>';
        for (let i = 1; i <= daysCount; i++) {
            const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const record = appData.trainingRecords.find(r => r.date === dateStr);
            const hasRecord = record && record.exercises && record.exercises.length > 0;
            const isSelected = selectedDate === dateStr;
            const totalVolume = hasRecord ? record.exercises.reduce((sum, ex) => sum + (ex.volume || 0), 0) : 0;
            html += `<div class="calendar-day ${hasRecord ? 'has-record' : ''} ${isSelected ? 'selected' : ''}" data-date="${dateStr}">
                        <span class="day-number">${i}</span>
                        ${hasRecord ? `<div class="record-dot"></div><div class="record-badge">${totalVolume}kg</div>` : ''}
                    </div>`;
        }
        const calendarDays = document.getElementById('calendarDays');
        const currentMonthSpan = document.getElementById('currentMonth');
        if (calendarDays) calendarDays.innerHTML = html;
        if (currentMonthSpan) currentMonthSpan.innerText = `${currentYear}年${currentMonth}月`;
        document.querySelectorAll('.calendar-day[data-date]').forEach(day => {
            day.onclick = (e) => { e.stopPropagation(); selectedDate = day.dataset.date; renderCalendar(); showTrainingDetail(selectedDate); };
        });
    }
    
    function showTrainingDetail(date) {
        const record = appData.trainingRecords.find(r => r.date === date);
        const exercises = record?.exercises || [];
        const totalVolume = exercises.reduce((sum, ex) => sum + (ex.volume || 0), 0);
        let detailModal = document.getElementById('trainingDetailModal');
        if (!detailModal) {
            detailModal = document.createElement('div');
            detailModal.id = 'trainingDetailModal';
            detailModal.className = 'modal';
            detailModal.innerHTML = `<div class="modal-content" style="max-width: 500px;">
                <div class="modal-header"><h3 id="detailDate">训练记录</h3><span class="modal-close" id="closeDetailModal">✕</span></div>
                <div id="detailContent" style="max-height: 400px; overflow-y: auto;"><div style="text-align: center; padding: 40px;">加载中...</div></div>
                <button class="add-food-btn" id="addTrainingFromDetail" style="margin-top: 20px;">+ 添加训练动作</button>
            </div>`;
            document.body.appendChild(detailModal);
            document.getElementById('closeDetailModal').onclick = () => detailModal.classList.remove('active');
            detailModal.onclick = (e) => { if (e.target === detailModal) detailModal.classList.remove('active'); };
        }
        // 每次打开详情都重新绑定"添加训练动作"按钮，确保使用当前选中的 date
        const addTrainingBtn = document.getElementById('addTrainingFromDetail');
        addTrainingBtn.onclick = () => { detailModal.classList.remove('active'); showAddTrainingForm(date); };
        document.getElementById('detailDate').innerHTML = `${date} 训练记录 ${totalVolume > 0 ? `(总容量: ${totalVolume}kg)` : ''}`;
        const detailContent = document.getElementById('detailContent');
        if (exercises.length === 0) {
            detailContent.innerHTML = `<div style="text-align: center; padding: 40px;"><div style="font-size: 48px; margin-bottom: 16px;">🏋️</div><div style="color: var(--text-secondary);">暂无训练记录</div><div style="font-size: 13px; color: var(--text-tertiary); margin-top: 8px;">点击下方按钮添加</div></div>`;
        } else {
            detailContent.innerHTML = `<div style="display: flex; flex-direction: column; gap: 12px;">
                ${exercises.map((ex, idx) => `<div class="training-record-card"><div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex: 1;"><strong style="font-size: 16px;">${ex.name}</strong>
                    <div style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">${ex.sets}组 × ${ex.reps}次 × ${ex.weight}kg</div>
                    <div style="font-size: 12px; color: var(--primary); margin-top: 4px;">容量: ${ex.volume}kg</div></div>
                    <div style="display: flex; gap: 8px;">
                        <button class="edit-exercise-btn" data-index="${idx}" style="background: var(--primary-light); border: none; padding: 6px 12px; border-radius: 20px; color: var(--primary); cursor: pointer;">编辑</button>
                        <button class="delete-exercise-btn" data-index="${idx}" style="background: var(--secondary-light); border: none; padding: 6px 12px; border-radius: 20px; color: var(--secondary); cursor: pointer;">删除</button>
                    </div>
                </div></div>`).join('')}
            </div>`;
            detailContent.querySelectorAll('.edit-exercise-btn').forEach(btn => { btn.onclick = () => { const idx = parseInt(btn.dataset.index); editTrainingExercise(date, idx); }; });
            detailContent.querySelectorAll('.delete-exercise-btn').forEach(btn => { btn.onclick = () => { const idx = parseInt(btn.dataset.index); customConfirm('确定删除这条训练记录吗？', (confirmed) => { if (confirmed) { const record = appData.trainingRecords.find(r => r.date === date); if (record) { record.exercises.splice(idx, 1); if (record.exercises.length === 0) { const ri = appData.trainingRecords.findIndex(r => r.date === date); if (ri !== -1) appData.trainingRecords.splice(ri, 1); } saveUserData(); renderCalendar(); showTrainingDetail(date); } } }); }; });
        }
        detailModal.classList.add('active');
    }
    
    function showAddTrainingForm(date) {
        let addModal = document.getElementById('addTrainingModal');
        if (!addModal) {
            addModal = document.createElement('div');
            addModal.id = 'addTrainingModal';
            addModal.className = 'modal';
            addModal.innerHTML = `<div class="modal-content" style="max-width: 450px;">
                <div class="modal-header"><h3>添加训练记录</h3><span class="modal-close" id="closeAddModal">✕</span></div>
                <div style="margin-bottom: 16px;"><label style="display: block; margin-bottom: 8px;">动作名称</label><input type="text" id="exerciseName" class="input-field" placeholder="例如：深蹲"></div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px;">
                    <div><label>组数</label><input type="number" id="exerciseSets" class="input-field" placeholder="组数"></div>
                    <div><label>次数</label><input type="number" id="exerciseReps" class="input-field" placeholder="次数"></div>
                    <div><label>重量(kg)</label><input type="number" id="exerciseWeight" class="input-field" placeholder="重量"></div>
                </div>
                <button id="saveTrainingBtn" class="auth-btn">保存记录</button>
            </div>`;
            document.body.appendChild(addModal);
            document.getElementById('closeAddModal').onclick = () => addModal.classList.remove('active');
            addModal.onclick = (e) => { if (e.target === addModal) addModal.classList.remove('active'); };
        }
        document.getElementById('exerciseName').value = '';
        document.getElementById('exerciseSets').value = '';
        document.getElementById('exerciseReps').value = '';
        document.getElementById('exerciseWeight').value = '0';
        const saveBtn = document.getElementById('saveTrainingBtn');
        const newSaveHandler = () => {
            const name = document.getElementById('exerciseName').value;
            const sets = parseInt(document.getElementById('exerciseSets').value);
            const reps = parseInt(document.getElementById('exerciseReps').value);
            const weight = parseInt(document.getElementById('exerciseWeight').value) || 0;
            if (!name || isNaN(sets) || !sets || isNaN(reps) || !reps) { customAlert('请填写完整信息'); return; }
            if (sets <= 0 || reps <= 0 || weight < 0) { customAlert('组数和次数需大于0，重量不能为负数'); return; }
            const newExercise = { id: Date.now(), name, sets, reps, weight, volume: sets * reps * weight };
            let record = appData.trainingRecords.find(r => r.date === date);
            if (!record) { record = { date, exercises: [] }; appData.trainingRecords.push(record); }
            record.exercises.push(newExercise);
            saveUserData();
            renderCalendar();
            addModal.classList.remove('active');
            showTrainingDetail(date);
        };
        saveBtn.removeEventListener('click', saveBtn.clickHandler);
        saveBtn.clickHandler = newSaveHandler;
        saveBtn.addEventListener('click', saveBtn.clickHandler);
        addModal.classList.add('active');
    }
    
    function editTrainingExercise(date, index) {
        const record = appData.trainingRecords.find(r => r.date === date);
        if (!record || !record.exercises[index]) return;
        const exercise = record.exercises[index];
        let editModal = document.getElementById('editTrainingModal');
        if (!editModal) {
            editModal = document.createElement('div');
            editModal.id = 'editTrainingModal';
            editModal.className = 'modal';
            editModal.innerHTML = `<div class="modal-content" style="max-width: 450px;">
                <div class="modal-header"><h3>编辑训练记录</h3><span class="modal-close" id="closeEditModal">✕</span></div>
                <div style="margin-bottom: 16px;"><label>动作名称</label><input type="text" id="editExerciseName" class="input-field"></div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px;">
                    <div><label>组数</label><input type="number" id="editExerciseSets" class="input-field"></div>
                    <div><label>次数</label><input type="number" id="editExerciseReps" class="input-field"></div>
                    <div><label>重量(kg)</label><input type="number" id="editExerciseWeight" class="input-field"></div>
                </div>
                <button id="updateTrainingBtn" class="auth-btn">更新记录</button>
            </div>`;
            document.body.appendChild(editModal);
            document.getElementById('closeEditModal').onclick = () => editModal.classList.remove('active');
            editModal.onclick = (e) => { if (e.target === editModal) editModal.classList.remove('active'); };
        }
        document.getElementById('editExerciseName').value = exercise.name;
        document.getElementById('editExerciseSets').value = exercise.sets;
        document.getElementById('editExerciseReps').value = exercise.reps;
        document.getElementById('editExerciseWeight').value = exercise.weight;
        const updateBtn = document.getElementById('updateTrainingBtn');
        const newUpdateHandler = () => {
            const name = document.getElementById('editExerciseName').value;
            const sets = parseInt(document.getElementById('editExerciseSets').value);
            const reps = parseInt(document.getElementById('editExerciseReps').value);
            const weight = parseInt(document.getElementById('editExerciseWeight').value) || 0;
            if (!name || isNaN(sets) || !sets || isNaN(reps) || !reps) { customAlert('请填写完整信息'); return; }
            if (sets <= 0 || reps <= 0 || weight < 0) { customAlert('组数和次数需大于0，重量不能为负数'); return; }
            const record = appData.trainingRecords.find(r => r.date === date);
            if (record && record.exercises[index]) {
                record.exercises[index] = { ...record.exercises[index], name, sets, reps, weight, volume: sets * reps * weight };
                saveUserData();
                renderCalendar();
                editModal.classList.remove('active');
                showTrainingDetail(date);
            }
        };
        updateBtn.removeEventListener('click', updateBtn.clickHandler);
        updateBtn.clickHandler = newUpdateHandler;
        updateBtn.addEventListener('click', updateBtn.clickHandler);
        editModal.classList.add('active');
    }
    
    renderCalendar();
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const todayBtn = document.getElementById('todayBtn');
    if (prevMonthBtn) prevMonthBtn.onclick = () => { if (currentMonth === 1) { currentYear--; currentMonth = 12; } else { currentMonth--; } renderCalendar(); };
    if (nextMonthBtn) nextMonthBtn.onclick = () => { if (currentMonth === 12) { currentYear++; currentMonth = 1; } else { currentMonth++; } renderCalendar(); };
    if (todayBtn) todayBtn.onclick = () => { currentYear = new Date().getFullYear(); currentMonth = new Date().getMonth() + 1; selectedDate = new Date().toISOString().slice(0, 10); renderCalendar(); showTrainingDetail(selectedDate); };
}

function renderMyPage() {
    const nicknameInput = document.getElementById('nickname');
    const genderSelect = document.getElementById('gender');
    const heightInput = document.getElementById('height');
    if (nicknameInput) nicknameInput.value = appData.userInfo.nickname || currentUser?.nickname || '';
    if (genderSelect) genderSelect.value = appData.userInfo.gender || '';
    if (heightInput) heightInput.value = appData.userInfo.height || '';
    
    const weights = appData.weightRecords.sort((a,b) => new Date(a.date) - new Date(b.date));
    const latest = weights[weights.length - 1];
    const first = weights[0];
    const change = latest && first ? (latest.weight - first.weight).toFixed(1) : 0;
    const weightStats = document.getElementById('weightStats');
    if (weightStats) weightStats.innerHTML = `<div><div class="stat-value">${weights.length}</div><div>记录次数</div></div><div><div class="stat-value">${latest ? latest.weight : '暂无'}</div><div>最新体重(kg)</div></div><div><div class="stat-value ${change >= 0 ? 'up' : 'down'}" style="color: ${change >= 0 ? '#FFA67F' : '#2DD4BF'}">${change >= 0 ? '+' : ''}${change}</div><div>总变化(kg)</div></div>`;
    
    const weightList = document.getElementById('weightList');
    if (weightList) weightList.innerHTML = weights.slice().reverse().map(w => `<div class="weight-row"><span>${w.date}</span><span style="color: var(--primary); font-weight: 500;">${w.weight} kg</span></div>`).join('') || '<div class="weight-row">暂无记录</div>';
    drawWeightChart(weights);
    renderBindStatus();
}

function drawWeightChart(weights) {
    const canvas = document.getElementById('weightChart');
    if (!canvas || weights.length < 2) return;
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    const width = container ? container.clientWidth - 40 : 400;
    const height = 250;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#F8F9FA';
    ctx.fillRect(0, 0, width, height);
    const maxWeight = Math.max(...weights.map(w => w.weight)) + 2;
    const minWeight = Math.min(...weights.map(w => w.weight)) - 2;
    const range = maxWeight - minWeight;
    const points = weights.map((w, i) => ({ x: (i / (weights.length - 1)) * width, y: height - ((w.weight - minWeight) / range) * height }));
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.strokeStyle = '#2DD4BF';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    points.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI); ctx.fillStyle = '#2DD4BF'; ctx.fill(); ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI); ctx.fillStyle = 'white'; ctx.fill(); });
}