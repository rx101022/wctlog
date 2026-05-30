// =================== 会员专属功能 ===================

// 会员名称常量
const PRO_NAME = '碗秤铁PRO';

// 检查并解锁会员功能
function unlockPremiumFeature(feature) {
    // AI识别功能现在是免费的
    if (feature === 'aiFood') {
        if (typeof startAIFoodRecognition === 'function') {
            startAIFoodRecognition();
        }
        return true;
    }

    if (!appData.isPremium) {
        // 免费用户，提示升级
        customConfirm('此功能为' + PRO_NAME + '专属功能，升级即可使用！', (confirmed) => {
            if (confirmed) {
                const vipModal = document.getElementById('vipModal');
                if (vipModal) vipModal.classList.add('active');
            }
        });
        return false;
    }
    
    // 会员用户，执行对应功能
    switch(feature) {
        case 'dietAnalysis':
            renderDietAnalysis();
            break;
        case 'weightAnalysis':
            renderWeightAnalysis();
            break;
        case 'trainingReport':
            // 显示训练报告已解锁UI
            const trainingReportLock = document.getElementById('trainingReportLock');
            const trainingReportContent = document.getElementById('trainingReportContent');
            const trainingReportResult = document.getElementById('trainingReportResult');
            if (trainingReportLock) trainingReportLock.style.display = 'none';
            if (trainingReportContent) trainingReportContent.style.display = 'none';
            if (trainingReportResult) trainingReportResult.style.display = 'block';
            break;
    }
    return true;
}

// =================== 饮食分析 ===================

function renderDietAnalysis() {
    if (!appData.isPremium) return; // 非VIP直接返回，不显示报告
    
    const container = document.getElementById('dietAnalysisResult');
    const lockIcon = document.getElementById('dietAnalysisLock');
    
    if (!container) return;
    
    // 获取今日饮食数据
    const todayRecord = appData.dietRecords.find(r => r.date === appData.currentDate);
    const meals = todayRecord?.meals || [];
    const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
    const totalProtein = meals.reduce((sum, m) => {
        return sum + (m.foods || []).reduce((s, f) => s + (f.protein || 0), 0);
    }, 0);
    
    // 计算营养评分（基于热量、蛋白质、餐数）
    let score = 0; // 初始0分，有达标项才加分

    // 1. 记录了食物才有基础分（最高40分）
    const actualMealCount = meals.filter(m => (m.foods || []).length > 0).length;
    if (actualMealCount > 0) {
        score += 10; // 基础分：有记录
        score += Math.min(actualMealCount * 10, 30); // 每有1餐+10，最多3餐+30
    }

    // 2. 热量达标加分（最高20分）
    if (totalCalories >= 1200 && totalCalories <= 2000) score += 20;
    else if (totalCalories >= 800 && totalCalories <= 2500) score += 10;

    // 3. 蛋白质达标加分（最高20分）
    if (totalProtein >= 50) score += 20;
    else if (totalProtein >= 30) score += 10;

    // 4. 营养均衡加分（最高20分）
    const carbs = meals.reduce((sum, m) => sum + (m.foods || []).reduce((s, f) => s + (f.carbs || 0), 0), 0);
    const fat = meals.reduce((sum, m) => sum + (m.foods || []).reduce((s, f) => s + (f.fat || 0), 0), 0);
    if (totalCalories > 0) {
        // 三大营养素比例合理（有碳水、有蛋白质、有脂肪但不过量）
        if (carbs > 0 && totalProtein > 0 && fat > 0) score += 10;
        // 蛋白质供能比合理（10%-30%为佳）
        const proteinCal = totalProtein * 4;
        const proteinRatio = proteinCal / totalCalories;
        if (proteinRatio >= 0.1 && proteinRatio <= 0.35) score += 10;
    }

    score = Math.min(Math.max(score, 0), 100); // 限制在0-100之间
    
    // 饮食建议
    let suggestion = '';
    if (meals.filter(m => (m.foods || []).length > 0).length === 0) {
        suggestion = '今天还没有饮食记录，建议按时进餐，保持规律饮食';
    } else if (totalCalories < 1200) {
        suggestion = '热量摄入偏低，建议增加主食和蛋白质摄入';
    } else if (totalCalories > 2500) {
        suggestion = '热量摄入偏高，建议控制高油高糖食物';
    } else {
        suggestion = '饮食热量适中，建议保持蔬菜水果的摄入';
    }
    
    // 营养素分析（carbs, fat, actualMealCount 已在评分计算中定义）

    // 更新UI
    container.style.display = 'block';
    document.getElementById('nutritionScore').innerText = score + '分';
    document.getElementById('dietSuggestion').innerText = suggestion;
    
    // 隐藏升级按钮区域
    const dietAnalysisContent = document.getElementById('dietAnalysisContent');
    if (dietAnalysisContent) dietAnalysisContent.style.display = 'none';
    
    // 添加详细分析
    let detailHtml = `
        <div class="analysis-detail" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border);">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; text-align: center;">
                <div>
                    <div style="font-size: 24px; font-weight: 700; color: var(--primary);">${totalCalories}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">总热量(千卡)</div>
                </div>
                <div>
                    <div style="font-size: 24px; font-weight: 700; color: var(--primary);">${actualMealCount}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">记录餐数</div>
                </div>
                <div>
                    <div style="font-size: 24px; font-weight: 700; color: var(--primary);">${totalProtein.toFixed(1)}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">蛋白质(g)</div>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; text-align: center; margin-top: 12px;">
                <div>
                    <div style="font-size: 24px; font-weight: 700; color: var(--primary);">${carbs.toFixed(1)}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">碳水(g)</div>
                </div>
                <div>
                    <div style="font-size: 24px; font-weight: 700; color: var(--primary);">${fat.toFixed(1)}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">脂肪(g)</div>
                </div>
            </div>
        </div>
    `;
    
    // 检查是否已存在详细分析，避免重复添加
    const existingDetail = container.querySelector('.analysis-detail');
    if (existingDetail) {
        existingDetail.outerHTML = detailHtml;
    } else {
        container.insertAdjacentHTML('beforeend', detailHtml);
    }
    
    if (lockIcon) lockIcon.style.display = 'none';
}

// =================== 体重分析 ===================

function renderWeightAnalysis() {
    const resultDiv = document.getElementById('weightAnalysisResult');
    const lockDiv = document.getElementById('weightAnalysis');
    
    if (!resultDiv) return;
    
    // 获取体重数据
    const records = appData.weightRecords || [];
    
    if (records.length === 0) {
        resultDiv.style.display = 'block';
        document.getElementById('weightTrend').innerText = '暂无数据';
        document.getElementById('bmiValue').innerText = '-';
        document.getElementById('healthAdvice').innerText = '请先记录体重数据';
        return;
    }
    
    // 按日期排序
    records.sort((a, b) => a.date.localeCompare(b.date));
    
    const latest = records[records.length - 1].weight;
    const first = records[0].weight;
    const trend = latest - first;
    
    let trendText = '';
    if (trend > 0) {
        trendText = `上升 ${trend.toFixed(1)} kg`;
    } else if (trend < 0) {
        trendText = `下降 ${Math.abs(trend).toFixed(1)} kg`;
    } else {
        trendText = '保持稳定';
    }
    
    // 计算BMI（需要身高数据）
    const height = parseFloat(appData.userInfo.height) || 170; // 默认170cm
    const bmi = (latest / ((height / 100) * (height / 100))).toFixed(1);
    
    let bmiLevel = '';
    if (bmi < 18.5) bmiLevel = '偏瘦';
    else if (bmi < 24) bmiLevel = '正常';
    else if (bmi < 28) bmiLevel = '偏胖';
    else bmiLevel = '肥胖';
    
    // 健康建议
    let advice = '';
    if (bmi < 18.5) {
        advice = '体重偏轻，建议增加蛋白质和碳水化合物摄入';
    } else if (bmi < 24) {
        advice = '体重正常，请继续保持健康饮食和运动习惯';
    } else if (bmi < 28) {
        advice = '体重偏高，建议增加有氧运动，控制饮食热量';
    } else {
        advice = '体重过高，建议咨询专业医生或营养师制定减重计划';
    }
    
    // 更新UI
    resultDiv.style.display = 'block';
    document.getElementById('weightTrend').innerText = trendText;
    document.getElementById('bmiValue').innerText = bmi + ' (' + bmiLevel + ')';
    document.getElementById('healthAdvice').innerText = advice;
    
    if (lockDiv) {
        const lockMsg = lockDiv.querySelector('p');
        if (lockMsg) lockMsg.style.display = 'none';
        const lockBtn = lockDiv.querySelector('.premium-unlock-btn');
        if (lockBtn) lockBtn.style.display = 'none';
    }
}

// =================== AI食物识别 ===================

// ---- API 配置（按需填入密钥，留空则使用模拟模式）----
const AI_CONFIG = {
    // 模式: 'mock'（模拟）| 'qwen'（阿里云百炼，建议）
    mode: 'qwen',  // 使用阿里云百炼真实API
    // 阿里云百炼API配置（申请地址：https://bailian.console.aliyun.com）
    qwen: {
        // 填入你的API Key（格式：sk-xxxx）
        apiKey: 'sk-9fa4a7bb4c9c42dca7409224f51d17e2',
        // 支持图像的视觉语言模型
        model: 'qwen-vl-plus', 
        endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
    }
};

// AI识别功能在 events.js 中初始化（按钮事件绑定）

/**
 * 解析 AI 返回的文本，提取食物名称和营养数据
 * 期望格式（让 AI 按此格式输出）：
 * 食物名称: xxx
 * 热量: xxx千卡
 * 蛋白质: xxxg
 * 碳水: xxxg
 * 脂肪: xxxg
 */
function parseAIFoodResult(text) {
    const lines = text.split('\n');
    const result = { name: '未知食物', calories: 0, protein: 0, carbs: 0, fat: 0 };
    lines.forEach(line => {
        const num = parseFloat(line.replace(/[^\d.]/g, ''));
        if (line.includes('食物') || line.includes('名称')) result.name = line.split(/[:：]/).pop().trim() || result.name;
        else if (line.includes('热量') || line.includes('卡路里')) result.calories = isNaN(num) ? 0 : num;
        else if (line.includes('蛋白质')) result.protein = isNaN(num) ? 0 : num;
        else if (line.includes('碳水')) result.carbs = isNaN(num) ? 0 : num;
        else if (line.includes('脂肪')) result.fat = isNaN(num) ? 0 : num;
    });
    return result;
}

/**
 * 调用阿里云百炼 qwen-vl-plus 识别图片中的食物
 */
async function callQwenVL(base64Image, mimeType) {
    const response = await fetch(AI_CONFIG.qwen.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AI_CONFIG.qwen.apiKey}`
        },
        body: JSON.stringify({
            model: AI_CONFIG.qwen.model,
            messages: [{
                role: 'user',
                content: [
                    {
                        type: 'image_url',
                        image_url: { url: `data:${mimeType};base64,${base64Image}` }
                    },
                    {
                        type: 'text',
                        text: '请仔细识别图片中的食物，估算该食物每100g的热量和营养成分（请根据常识合理估算，不要随意写很低的数值）。严格按以下格式输出（只输出这5行，不要其他内容）：\n食物名称: xxx\n热量: xxx千卡\n蛋白质: xxxg\n碳水: xxxg\n脂肪: xxxg'
                    }
                ]
            }]
        })
    });
    if (!response.ok) throw new Error(`API请求失败: ${response.status}`);
    const data = await response.json();
    return parseAIFoodResult(data.choices[0].message.content);
}

/**
 * 展示识别结果卡片
 */
function showAIFoodResult(dataUrl, food) {
    const oldResult = document.querySelector('.ai-result');
    if (oldResult) oldResult.remove();

    const resultHtml = `
        <div class="ai-result" style="margin-top: 20px; padding: 16px; background: var(--card-bg); border-radius: 16px; border: 1px solid var(--border);">
            <h4 style="margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">🤖 AI识别结果</h4>
            <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
                <img src="${dataUrl}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 12px; flex-shrink: 0;">
                <div style="flex: 1; min-width: 120px;">
                    <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">${food.name}</div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; font-size: 13px; color: var(--text-secondary);">
                        <div>🔥 热量: <span id="aiCalDisplay">${food.calories}</span> 千卡/100g</div>
                        <div>💪 蛋白质: ${food.protein}g/100g</div>
                        <div>🍚 碳水: ${food.carbs}g/100g</div>
                        <div>🥑 脂肪: ${food.fat}g/100g</div>
                    </div>
                </div>
            </div>
            <div style="margin-top: 12px; display: flex; align-items: center; gap: 8px;">
                <label style="font-size: 13px; color: var(--text-secondary); flex-shrink: 0;">克重:</label>
                <input id="aiFoodWeight" type="number" placeholder="输入实际重量" min="1" value="100"
                    style="flex: 1; padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--input-bg); color: var(--text-primary); font-size: 14px; box-sizing: border-box;">
                <span style="font-size: 13px; color: var(--text-secondary); flex-shrink: 0;">g</span>
                <button class="auth-btn ai-add-btn" style="width: auto; padding: 8px 20px; flex-shrink: 0;">添加</button>
            </div>
        </div>
    `;

    const mealsGrid = document.getElementById('mealsGrid');
    if (mealsGrid) {
        mealsGrid.insertAdjacentHTML('beforebegin', resultHtml);
        const card = document.querySelector('.ai-result');
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // 克重输入框：实时更新热量显示
        const weightInput = document.getElementById('aiFoodWeight');
        const calDisplay = document.getElementById('aiCalDisplay');
        if (weightInput && calDisplay) {
            weightInput.oninput = () => {
                const weight = parseFloat(weightInput.value) || 100;
                const actualCal = Math.round((food.calories / 100) * weight);
                calDisplay.innerText = actualCal;
            };
        }

        // 添加按钮：按实际重量换算后添加
        const btn = document.querySelector('.ai-add-btn');
        if (btn) btn.onclick = () => {
            const weight = parseFloat(weightInput?.value) || 100;
            const actualCal = Math.round((food.calories / 100) * weight);
            const actualProtein = parseFloat(((food.protein / 100) * weight).toFixed(1));
            const actualCarbs = parseFloat(((food.carbs / 100) * weight).toFixed(1));
            const actualFat = parseFloat(((food.fat / 100) * weight).toFixed(1));
            addAIFood(food.name, actualCal, actualProtein, actualCarbs, actualFat);
        };
    }
}

function startAIFoodRecognition() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            customAlert('请选择图片文件');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            customAlert('图片大小不能超过5MB');
            return;
        }

        // 显示 loading 提示
        const oldResult = document.querySelector('.ai-result');
        if (oldResult) oldResult.remove();
        const loadingHtml = `
            <div class="ai-result" style="margin-top: 20px; padding: 24px; text-align: center; background: var(--card-bg); border-radius: 16px; border: 1px solid var(--border);">
                <div style="font-size: 32px; margin-bottom: 12px;">🤖</div>
                <div style="font-size: 15px; color: var(--text-secondary);">AI识别中，请稍候...</div>
            </div>`;
        const mealsGrid = document.getElementById('mealsGrid');
        if (mealsGrid) mealsGrid.insertAdjacentHTML('beforebegin', loadingHtml);

        const reader = new FileReader();
        reader.onload = async (event) => {
            const dataUrl = event.target.result;
            // dataUrl 格式: data:image/jpeg;base64,XXXX
            const base64Image = dataUrl.split(',')[1];
            const mimeType = file.type;

            try {
                let food;
                const mode = AI_CONFIG.mode;

                if (mode === 'qwen' && AI_CONFIG.qwen.apiKey) {
                    food = await callQwenVL(base64Image, mimeType);
                } else {
                    // 模拟模式：延迟1.5秒返回随机结果
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    const mockFoods = [
                        { name: '米饭(200g)', calories: 232, protein: 4.8, carbs: 51, fat: 0.6 },
                        { name: '鸡胸肉(150g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
                        { name: '西兰花(200g)', calories: 70, protein: 5.8, carbs: 13.6, fat: 0.8 },
                        { name: '全麦面包(2片)', calories: 138, protein: 5.6, carbs: 26, fat: 2.2 },
                        { name: '香蕉(1根)', calories: 93, protein: 1.1, carbs: 21.8, fat: 0.3 },
                        { name: '水煮蛋(2个)', calories: 156, protein: 12.6, carbs: 0.6, fat: 11 }
                    ];
                    food = mockFoods[Math.floor(Math.random() * mockFoods.length)];
                }

                showAIFoodResult(dataUrl, food);
            } catch (err) {
                // 移除loading，显示错误
                const loading = document.querySelector('.ai-result');
                if (loading) loading.remove();
                customAlert('识别失败：' + (err.message || '网络错误，请检查API配置'));
            }
        };
        reader.readAsDataURL(file);
    };

    input.click();
}

function addAIFood(name, calories, protein, carbs, fat) {
    customSelect('选择餐次', ['早餐', '午餐', '晚餐', '加餐'], (mealName) => {
        if (!mealName) return;

        const mealKey = mealName === '早餐' ? 'breakfast' :
                       mealName === '午餐' ? 'lunch' :
                       mealName === '晚餐' ? 'dinner' : 'snack';

        let todayRecord = appData.dietRecords.find(r => r.date === appData.currentDate);
        if (!todayRecord) {
            todayRecord = { date: appData.currentDate, meals: [] };
            appData.dietRecords.push(todayRecord);
        }

        let meal = todayRecord.meals.find(m => m.type === mealKey);
        if (!meal) {
            meal = { type: mealKey, foods: [], calories: 0 };
            todayRecord.meals.push(meal);
        }

        meal.foods.push({
            name,
            calories: calories || 0,
            protein: protein || 0,
            carbs: carbs || 0,
            fat: fat || 0
        });
        meal.calories += (calories || 0);

        saveUserData();
        renderDietPage();
        if (typeof renderDietAnalysis === 'function') renderDietAnalysis();
        customAlert('已添加到' + mealName + '！');

        const aiResult = document.querySelector('.ai-result');
        if (aiResult) aiResult.remove();
    });
}

// =================== 训练报告导出（免费功能）====================

function exportTrainingReport(reportType = 'all') {
    if (!appData.isPremium) {
        customConfirm('训练报告导出为碗秤铁PRO专属功能，升级会员即可使用！', (confirmed) => {
            if (confirmed) {
                const vipModal = document.getElementById('vipModal');
                if (vipModal) vipModal.classList.add('active');
            }
        });
        return;
    }
    
    let records = appData.trainingRecords || [];
    
    if (records.length === 0) {
        // 不再弹窗，直接显示暂无数据的报告预览
        let report = `
            <div class="report-preview" id="reportPreview">
                <div class="report-header">
                    <div class="report-title">碗秤铁记录本 - 训练报告（${reportTitle}）</div>
                    <div class="report-subtitle">生成时间：${new Date().toLocaleDateString('zh-CN')} | 数据范围：${reportType === 'weekly' ? '本周' : reportType === 'monthly' ? '本月' : '全部'}</div>
                </div>
                <div style="text-align: center; padding: 60px 20px; color: var(--text-secondary);">
                    <div style="font-size: 48px; margin-bottom: 16px;">📭</div>
                    <div style="font-size: 16px; margin-bottom: 8px;">暂无训练数据</div>
                    <div style="font-size: 13px;">本期（${reportTitle}）没有训练记录，快去记录吧！</div>
                </div>
            </div>
        `;
        
        // 显示报告预览
        const previewModal = document.createElement('div');
        previewModal.className = 'modal active';
        previewModal.id = 'reportModal';
        previewModal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2>训练报告预览（${reportTitle}）</h2>
                    <span class="modal-close" onclick="document.getElementById('reportModal')?.remove()">✕</span>
                </div>
                ${report}
                <div style="padding: 20px; display: flex; gap: 12px; justify-content: center;">
                    <button class="auth-btn-secondary" style="width: auto; padding: 12px 32px;" onclick="document.getElementById('reportModal')?.remove()">关闭</button>
                </div>
            </div>
        `;
        document.body.appendChild(previewModal);
        return;
    }
    
    // 根据报告类型过滤数据
    const now = new Date();
    let startDate, reportTitle;
    
    if (reportType === 'weekly') {
        // 本周一
        const day = now.getDay() || 7;
        startDate = new Date(now);
        startDate.setDate(now.getDate() - day + 1);
        startDate.setHours(0, 0, 0, 0);
        reportTitle = '周报';
    } else if (reportType === 'monthly') {
        // 本月1号
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        reportTitle = '月报';
    } else {
        reportTitle = '全部';
    }
    
    if (startDate) {
        const startDateStr = startDate.toISOString().slice(0, 10);
        records = records.filter(r => r.date >= startDateStr);
    }
    
    if (records.length === 0) {
        // 显示暂无数据的报告预览
        let report = `
            <div class="report-preview" id="reportPreview">
                <div class="report-header">
                    <div class="report-title">碗秤铁记录本 - 训练报告（${reportTitle}）</div>
                    <div class="report-subtitle">生成时间：${new Date().toLocaleDateString('zh-CN')} | 数据范围：${reportType === 'weekly' ? '本周' : reportType === 'monthly' ? '本月' : '全部'}</div>
                </div>
                <div style="text-align: center; padding: 60px 20px; color: var(--text-secondary);">
                    <div style="font-size: 48px; margin-bottom: 16px;">📭</div>
                    <div style="font-size: 16px; margin-bottom: 8px;">暂无训练数据</div>
                    <div style="font-size: 13px;">本期（${reportTitle}）没有训练记录，快去记录吧！</div>
                </div>
            </div>
        `;
        
        const previewModal = document.createElement('div');
        previewModal.className = 'modal active';
        previewModal.id = 'reportModal';
        previewModal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2>训练报告预览（${reportTitle}）</h2>
                    <span class="modal-close" onclick="document.getElementById('reportModal')?.remove()">✕</span>
                </div>
                ${report}
                <div style="padding: 20px; display: flex; gap: 12px; justify-content: center;">
                    <button class="auth-btn-secondary" style="width: auto; padding: 12px 32px;" onclick="document.getElementById('reportModal')?.remove()">关闭</button>
                </div>
            </div>
        `;
        document.body.appendChild(previewModal);
        return;
    }
    
    // 生成报告内容
    // 计算总动作数（所有记录的 exercises 之和）
    const totalExercises = records.reduce((sum, r) => sum + (r.exercises?.length || 0), 0);
    let report = `
        <div class="report-preview" id="reportPreview">
            <div class="report-header">
                <div class="report-title">碗秤铁记录本 - 训练报告（${reportTitle}）</div>
                <div class="report-subtitle">生成时间：${new Date().toLocaleDateString('zh-CN')} | 数据范围：${reportType === 'weekly' ? '本周' : reportType === 'monthly' ? '本月' : '全部'}</div>
            </div>
            
            <div class="report-section">
                <div class="report-section-title">📊 训练概览</div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
                    <div>
                        <div style="font-size: 32px; font-weight: 700; color: var(--primary);">${[...new Set(records.map(r => r.date))].length}</div>
                        <div style="font-size: 13px; color: var(--text-secondary);">训练天数</div>
                    </div>
                    <div>
                        <div style="font-size: 32px; font-weight: 700; color: var(--primary);">${totalExercises}</div>
                        <div style="font-size: 13px; color: var(--text-secondary);">总动作数</div>
                    </div>
                    <div>
                        <div style="font-size: 32px; font-weight: 700; color: var(--primary);">${records.reduce((sum, r) => sum + (r.exercises?.reduce((s, ex) => s + (ex.volume || 0), 0) || 0), 0)}</div>
                        <div style="font-size: 13px; color: var(--text-secondary);">总训练量(kg)</div>
                    </div>
                </div>
            </div>
            
            <div class="report-section">
                <div class="report-section-title">📋 训练记录</div>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>日期</th>
                            <th>动作</th>
                            <th>组数</th>
                            <th>次数</th>
                            <th>重量(kg)</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    records.forEach(record => {
        const exercises = record.exercises || [];
        if (exercises.length === 0) {
            report += `
                <tr>
                    <td>${record.date}</td>
                    <td colspan="4" style="text-align:center; color: var(--text-secondary);">暂无动作记录</td>
                </tr>
            `;
        } else {
            exercises.forEach((ex, idx) => {
                report += `
                    <tr>
                        <td>${idx === 0 ? record.date : ''}</td>
                        <td>${ex.name || '-'}</td>
                        <td>${ex.sets || '-'}</td>
                        <td>${ex.reps || '-'}</td>
                        <td>${ex.weight || '-'}</td>
                    </tr>
                `;
            });
        }
    });
    
    report += `
                    </tbody>
                </table>
            </div>
            
            <div class="report-section">
                <div class="report-section-title">💡 训练建议</div>
                <div style="padding: 16px; background: var(--bg-page); border-radius: 12px; font-size: 14px; color: var(--text-secondary); line-height: 1.8;">
                    ${records.length < 3 ? '• 建议每周至少训练3-4次，保持规律<br>' : '• 训练频率良好，请继续保持<br>'}
                    ${[...new Set(records.map(r => r.date))].length < 3 ? '• 建议增加训练天数，让身体充分激活<br>' : ''}
                    • 注意训练后的拉伸恢复，避免过度训练<br>
                    • 配合饮食记录，效果更佳
                </div>
            </div>
        </div>
    `;
    
    // 显示报告预览
    const previewModal = document.createElement('div');
    previewModal.className = 'modal active';
    previewModal.id = 'reportModal';
    previewModal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <h2>训练报告预览（${reportTitle}）</h2>
                <span class="modal-close" onclick="document.getElementById('reportModal').remove()">✕</span>
            </div>
            ${report}
            <div style="padding: 20px; display: flex; gap: 12px; justify-content: center;">
                <button class="auth-btn" style="width: auto; padding: 12px 32px;" onclick="downloadReport('${reportType}')">📥 下载报告</button>
                <button class="auth-btn-secondary" style="width: auto; padding: 12px 32px;" onclick="document.getElementById('reportModal').remove()">关闭</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(previewModal);
}

function downloadReport(reportType = 'all') {
    const preview = document.getElementById('reportPreview');
    if (!preview) return;
    
    const typeName = reportType === 'weekly' ? '周报' : reportType === 'monthly' ? '月报' : '全部';
    
    // 生成HTML报告
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <title>碗秤铁记录本 - 训练报告（${typeName}）</title>
            <style>
                body { font-family: -apple-system, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
                .report-header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #2DD4BF; }
                .report-title { font-size: 28px; font-weight: 700; color: #0F4C75; margin-bottom: 8px; }
                .report-section { margin-bottom: 32px; }
                .report-section-title { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 12px; text-align: left; border-bottom: 1px solid #E2E8F0; }
                th { background: #F8F9FA; font-weight: 600; }
            </style>
        </head>
        <body>
            ${preview.outerHTML}
        </body>
        </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `碗秤铁训练报告_${typeName}_${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    customAlert('报告已下载！');
}

// =================== 更新会员UI ===================

function updatePremiumUI() {
    const badge = document.getElementById('membershipBadge');
    const title = document.getElementById('memberTitle');
    const upgradeBtn = document.getElementById('upgradeBtn');
    const benefitsGrid = document.getElementById('benefitsGrid');
    
    // 游客模式：始终按免费用户显示，不读取localStorage会员数据
    const isGuest = window._isGuestMode === true;
    
    if (!isGuest && appData.isPremium) {
        // 会员状态
        const planNames = {
            newbie: '新人单次',
            weekly: '周卡',
            monthly: '月卡',
            quarterly: '季卡',
            halfyear: '半年卡',
            yearly: '年卡',
            lifetime: '永久会员'
        };
        const currentPlan = localStorage.getItem(CONFIG.STORAGE_KEYS.PREMIUM_PLAN);
        const planName = planNames[currentPlan] || PRO_NAME;
        
        if (badge) {
            badge.innerText = planName;
            badge.style.background = currentPlan === 'newbie'
                ? 'linear-gradient(135deg, #FF6B6B, #FFA500)'
                : currentPlan === 'lifetime'
                    ? 'linear-gradient(135deg, #8B5CF6, #EC4899)'
                    : 'linear-gradient(135deg, #FFD700, #FFA500)';
        }
        if (title) title.innerText = planName + PRO_NAME;
        if (upgradeBtn) {
            const expiryVal = localStorage.getItem(CONFIG.STORAGE_KEYS.PREMIUM_EXPIRY);
            const expiryText = (expiryVal === '2099-12-31T23:59:59.000Z') ? '永久有效' : (expiryVal?.slice(0, 10) || '未知');
            upgradeBtn.innerText = PRO_NAME + '有效期至：' + expiryText;
            upgradeBtn.disabled = true;
        }
        
        // 显示权益
        if (benefitsGrid) {
            benefitsGrid.innerHTML = [
                { icon: '📊', name: '饮食分析', status: '已解锁' },
                { icon: '📈', name: '体重分析', status: '已解锁' },
                { icon: '🤖', name: 'AI食物识别', status: '免费' },
                { icon: '📥', name: '训练报告导出', status: '已解锁' }
            ].map(b => `
                <div class="benefit-item">
                    <span>${b.icon} ${b.name}</span>
                    <span style="color: ${b.status === '已解锁' ? 'var(--primary)' : 'var(--secondary)'}; font-size: 12px;">${b.status}</span>
                </div>
            `).join('');
        }
        
        // 自动解锁功能
        renderDietAnalysis();
        renderWeightAnalysis();
        
        // AI识别功能通过 events.js 统一初始化，不需要在此处调用
        
        // 训练报告解锁UI
        const trainingReportLock = document.getElementById('trainingReportLock');
        const trainingReportContent = document.getElementById('trainingReportContent');
        const trainingReportResult = document.getElementById('trainingReportResult');
        if (trainingReportLock) trainingReportLock.style.display = 'none';
        if (trainingReportContent) trainingReportContent.style.display = 'none';
        if (trainingReportResult) trainingReportResult.style.display = 'block';
        
    } else {
        // 免费用户
        if (badge) {
            badge.innerText = '开通PRO';
            badge.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
        }
        if (title) title.innerText = '免费用户';
        if (upgradeBtn) {
            upgradeBtn.innerText = '升级为' + PRO_NAME;
            upgradeBtn.disabled = false;
        }
        
        // 显示权益
        if (benefitsGrid) {
            benefitsGrid.innerHTML = [
                { icon: '📊', name: '饮食分析', status: '未解锁' },
                { icon: '📈', name: '体重分析', status: '未解锁' },
                { icon: '🤖', name: 'AI食物识别', status: '免费' },
                { icon: '📥', name: '训练报告导出', status: '未解锁' }
            ].map(b => `
                <div class="benefit-item">
                    <span>${b.icon} ${b.name}</span>
                    <span style="color: ${b.status === '免费' ? 'var(--primary)' : 'var(--text-tertiary)'}; font-size: 12px;">${b.status}</span>
                </div>
            `).join('');
        }
        
        // 非会员用户：隐藏分析结果，显示锁定内容
        const dietAnalysisResult = document.getElementById('dietAnalysisResult');
        const dietAnalysisContent = document.getElementById('dietAnalysisContent');
        const dietAnalysisLock = document.getElementById('dietAnalysisLock');
        if (dietAnalysisResult) dietAnalysisResult.style.display = 'none';
        if (dietAnalysisContent) dietAnalysisContent.style.display = 'block';
        if (dietAnalysisLock) dietAnalysisLock.style.display = 'inline';
        
        // 训练报告显示锁定
        const trainingReportLock = document.getElementById('trainingReportLock');
        const trainingReportContent = document.getElementById('trainingReportContent');
        const trainingReportResult = document.getElementById('trainingReportResult');
        if (trainingReportLock) trainingReportLock.style.display = 'inline';
        if (trainingReportContent) trainingReportContent.style.display = 'block';
        if (trainingReportResult) trainingReportResult.style.display = 'none';
    }
    
    // 检查新人单次卡是否已使用，如果已使用则禁用（游客模式不检查，始终显示可领取）
    if (!isGuest) {
        const newbieUsed = localStorage.getItem('wancheng_newbie_used');
        const newbieCard = document.querySelector('.newbie-plan');
        const newbieBtn = newbieCard?.querySelector('.plan-select-btn');
        
        if (newbieUsed === 'true' && newbieCard) {
            newbieCard.style.opacity = '0.5';
            newbieCard.style.pointerEvents = 'none';
            if (newbieBtn) {
                newbieBtn.innerText = '已领取';
                newbieBtn.disabled = true;
                newbieBtn.style.background = '#ccc';
            }
        }
    }
}
