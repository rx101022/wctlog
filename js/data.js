// 动作库数据
const motionData = {
    categories: [
        { key: 'all', name: '全部' },
        { key: 'warmup', name: '热身' },
        { key: 'stretch', name: '拉伸' },
        { key: 'shoulder_back', name: '肩背' },
        { key: 'core', name: '腰腹' },
        { key: 'glutes_legs', name: '臀腿' },
        { key: 'other', name: '其他' }
    ],
    motions: [
        // 热身
        {
            id: 1, name: '上肢综合热身', category: 'warmup', duration: '5:00', difficulty: '初级',
            cover: 'https://picsum.photos/300/200?random=101',
            videoUrl: 'https://www.bilibili.com/video/BV1NKuXzaEkC/?spm_id_from=333.337.search-card.all.click&vd_source=2ab8a056ca70a80743ed50db3bcd9e5d',
            muscles: '肩部、颈部、手臂、胸背',
            tips: '动作幅度由小到大，循序渐进；各关节充分活动，感受肌肉发热为佳'
        },
        {
            id: 2, name: '下肢综合热身', category: 'warmup', duration: '5:00', difficulty: '初级',
            cover: 'https://picsum.photos/300/200?random=102',
            videoUrl: 'https://www.bilibili.com/video/BV1DspRe9E4k/?spm_id_from=333.337.search-card.all.click&vd_source=2ab8a056ca70a80743ed50db3bcd9e5d',
            muscles: '股四头肌、腘绳肌、臀肌、小腿',
            tips: '重心稳定，膝关节绕环时注意不要内扣；配合深呼吸，逐渐提高心率'
        },
        // 拉伸
        {
            id: 3, name: '上肢综合拉伸', category: 'stretch', duration: '5:00', difficulty: '初级',
            cover: 'https://picsum.photos/300/200?random=103',
            videoUrl: 'https://www.bilibili.com/video/BV1AZ421J74S/?spm_id_from=333.337.search-card.all.click&vd_source=2ab8a056ca70a80743ed50db3bcd9e5d',
            muscles: '胸大肌、背阔肌、三角肌、肱二头肌、肱三头肌',
            tips: '每个拉伸动作保持15～30秒，感受肌肉牵拉感即可，不要强行拉扯；呼气时加大拉伸幅度'
        },
        {
            id: 4, name: '下肢综合拉伸', category: 'stretch', duration: '5:00', difficulty: '初级',
            cover: 'https://picsum.photos/300/200?random=104',
            videoUrl: 'https://www.bilibili.com/video/BV1vh6jBqEGL/?spm_id_from=333.337.search-card.all.click&vd_source=2ab8a056ca70a80743ed50db3bcd9e5d',
            muscles: '股四头肌、腘绳肌、臀大肌、小腿腓肠肌',
            tips: '拉伸时保持自然呼吸，不要憋气；感觉到明显牵拉感后保持静止，避免弹振动作'
        },
        // 肩背
        {
            id: 5, name: '宽距高位下拉', category: 'shoulder_back', duration: '3:30', difficulty: '中级',
            cover: 'https://picsum.photos/300/200?random=105',
            videoUrl: 'https://www.bilibili.com/video/BV1Dot5zmESW/?spm_id_from=333.337.search-card.all.click&vd_source=2ab8a056ca70a80743ed50db3bcd9e5d',
            muscles: '背阔肌（主）、大圆肌、肱二头肌',
            tips: '下拉时想象用肘部带动而非手腕；保持胸部微挺，避免耸肩；顶部充分伸展背阔肌'
        },
        {
            id: 6, name: 'V字坐姿划船', category: 'shoulder_back', duration: '3:30', difficulty: '中级',
            cover: 'https://picsum.photos/300/200?random=106',
            videoUrl: 'https://www.bilibili.com/video/BV1oEnnzpEcR/?spm_id_from=333.337.search-card.all.click&vd_source=2ab8a056ca70a80743ed50db3bcd9e5d',
            muscles: '背阔肌、菱形肌、中下斜方肌、肱二头肌',
            tips: '拉至腹部时夹紧肩胛骨停顿1秒；躯干保持直立，不要过度后仰借力；缓慢放回感受离心收缩'
        },
        {
            id: 7, name: '蝴蝶机反向飞鸟', category: 'shoulder_back', duration: '3:00', difficulty: '中级',
            cover: 'https://picsum.photos/300/200?random=107',
            videoUrl: 'https://www.bilibili.com/video/BV1HWirByERZ/?spm_id_from=333.337.search-card.all.click&vd_source=2ab8a056ca70a80743ed50db3bcd9e5d',
            muscles: '后三角肌（主）、菱形肌、中斜方肌',
            tips: '双臂打开时想象用肘部向后推；顶峰收缩时夹紧肩胛骨；控制重量，全程感受后肩发力'
        },
        {
            id: 8, name: '坐姿器械推肩', category: 'shoulder_back', duration: '3:30', difficulty: '中级',
            cover: 'https://picsum.photos/300/200?random=108',
            videoUrl: 'https://www.bilibili.com/video/BV1XwoVYMEu4/?spm_id_from=333.337.search-card.all.click&vd_source=2ab8a056ca70a80743ed50db3bcd9e5d',
            muscles: '三角肌前束与中束（主）、肱三头肌、上胸',
            tips: '上推时不要完全锁肘，保留轻微弯曲；收紧核心稳定躯干；顶部不要用头部前顶代偿'
        },
        {
            id: 9, name: '哑铃侧平举', category: 'shoulder_back', duration: '3:00', difficulty: '初级',
            cover: 'https://picsum.photos/300/200?random=109',
            videoUrl: 'https://www.bilibili.com/video/BV12ZFGzwEqC/?spm_id_from=333.337.search-card.all.click&vd_source=2ab8a056ca70a80743ed50db3bcd9e5d',
            muscles: '三角肌中束（主）、冈上肌',
            tips: '举起时小拇指侧略高于大拇指侧（"倒水"姿势）；手臂抬至与肩平行即可，避免过度高举；全程缓慢控制，不要靠惯性甩动'
        },
        // 腰腹
        {
            id: 10, name: '马甲线', category: 'core', duration: '4:00', difficulty: '中级',
            cover: 'https://picsum.photos/300/200?random=110',
            videoUrl: 'https://www.bilibili.com/video/BV1C14y157Kx/?spm_id_from=333.337.search-card.all.click&vd_source=2ab8a056ca70a80743ed50db3bcd9e5d',
            muscles: '腹直肌、腹内外斜肌、腹横肌',
            tips: '全程下背部不要离地；呼气时收腹，感受腹肌发力而非借助颈部；动作放慢以增加训练效果'
        },
        {
            id: 11, name: '腹肌', category: 'core', duration: '3:00', difficulty: '初级',
            cover: 'https://picsum.photos/300/200?random=111',
            videoUrl: 'https://www.bilibili.com/video/BV1qh2WBGEVD/?spm_id_from=333.337.search-card.all.click&vd_source=2ab8a056ca70a80743ed50db3bcd9e5d',
            muscles: '腹直肌、腹横肌',
            tips: '起身时下颌微收，感受腹部卷缩发力；不要用双手拉颈部；下放时控制速度，不要猛然落下'
        },
        // 臀腿
        {
            id: 12, name: '坐姿髋外展', category: 'glutes_legs', duration: '3:30', difficulty: '初级',
            cover: 'https://picsum.photos/300/200?random=112',
            videoUrl: 'https://www.bilibili.com/video/BV1Qa4y1R7zw/?spm_id_from=333.337.search-card.all.click&vd_source=2ab8a056ca70a80743ed50db3bcd9e5d',
            muscles: '臀中肌（主）、臀小肌、梨状肌',
            tips: '坐正背部挺直，不要靠背；打开时感受臀部外侧收缩；顶峰收缩停顿1秒后缓慢还原'
        },
        {
            id: 13, name: '坐姿腿内收', category: 'glutes_legs', duration: '3:30', difficulty: '初级',
            cover: 'https://picsum.photos/300/200?random=113',
            videoUrl: 'https://www.bilibili.com/video/BV1Da4y1R7ju/?spm_id_from=333.337.search-card.all.click&vd_source=2ab8a056ca70a80743ed50db3bcd9e5d',
            muscles: '大腿内收肌群（耻骨肌、长收肌、股薄肌）',
            tips: '内收时感受大腿内侧发力夹紧；背部挺直不要弓腰；全程动作平稳，避免膝关节受到冲击'
        },
        {
            id: 14, name: '罗马尼亚硬拉', category: 'glutes_legs', duration: '4:00', difficulty: '中级',
            cover: 'https://picsum.photos/300/200?random=114',
            videoUrl: 'https://www.bilibili.com/video/BV1GoYmzxE4q/?spm_id_from=333.337.search-card.all.click&vd_source=2ab8a056ca70a80743ed50db3bcd9e5d',
            muscles: '臀大肌、腘绳肌（主）、竖脊肌',
            tips: '髋部主导屈伸，膝关节微屈保持不动；杠铃/哑铃贴近身体下行；下行至感受腘绳肌充分拉伸后再还原，不必追求触地'
        },
        {
            id: 15, name: '单侧保加利亚深蹲', category: 'glutes_legs', duration: '3:30', difficulty: '中级',
            cover: 'https://picsum.photos/300/200?random=115',
            videoUrl: 'https://www.bilibili.com/video/BV1FU69BDE3w/?spm_id_from=333.337.search-card.all.click&vd_source=2ab8a056ca70a80743ed50db3bcd9e5d',
            muscles: '臀大肌、股四头肌（主）、腘绳肌',
            tips: '前腿膝盖不要超过脚尖太多；重心在前脚，臀部向正下方下沉；躯干保持直立，收紧核心维持平衡'
        },
        // 其他
        {
            id: 17, name: '开合跳', category: 'other', duration: '2:00', difficulty: '初级',
            cover: 'https://picsum.photos/300/200?random=117',
            videoUrl: 'https://www.bilibili.com/video/BV1hS4y1N7jv/?spm_id_from=333.337.search-card.all.click&vd_source=2ab8a056ca70a80743ed50db3bcd9e5d',
            muscles: '全身有氧、三角肌、股四头肌、腓肠肌',
            tips: '落地时前脚掌先着地，膝关节微屈缓冲；保持节奏一致；手臂充分上举，带动肩部发力'
        },
        {
            id: 18, name: '跳绳', category: 'other', duration: '5:00', difficulty: '初级',
            cover: 'https://picsum.photos/300/200?random=118',
            videoUrl: 'https://www.bilibili.com/video/BV1jS4y1u7Zz/?spm_id_from=333.337.search-card.all.click&vd_source=2ab8a056ca70a80743ed50db3bcd9e5d',
            muscles: '小腿腓肠肌、比目鱼肌、肩部、核心',
            tips: '用手腕甩绳而非大臂摆动；跳起高度尽量低，足够绳子通过即可；前脚掌落地，保持膝关节微屈'
        },
        {
            id: 19, name: '高抬腿', category: 'other', duration: '2:00', difficulty: '初级',
            cover: 'https://picsum.photos/300/200?random=119',
            videoUrl: 'https://www.bilibili.com/video/BV1iv4y1A7zV/?spm_id_from=333.337.search-card.all.click&vd_source=2ab8a056ca70a80743ed50db3bcd9e5d',
            muscles: '髂腰肌、股四头肌、核心、心肺系统',
            tips: '大腿抬至与地面平行，膝关节90°；上半身保持直立，不要前倾；手臂自然协调摆动以维持平衡'
        },
        {
            id: 20, name: '深蹲', category: 'other', duration: '3:45', difficulty: '初级',
            cover: 'https://picsum.photos/300/200?random=120',
            videoUrl: 'https://www.bilibili.com/video/BV1NS4y1N7KV/?spm_id_from=333.337.search-card.all.click&vd_source=2ab8a056ca70a80743ed50db3bcd9e5d',
            muscles: '股四头肌、臀大肌（主）、腘绳肌、核心',
            tips: '双脚与肩同宽，脚尖微外八；下蹲时膝盖对齐脚尖方向，避免内扣；大腿至少平行于地面，全程保持腰背挺直'
        }
    ]
};

function saveUserData() {
    const userKey = `wancheng_data_${currentUser?.id || 'default'}`;
    localStorage.setItem(userKey, JSON.stringify({
        dietRecords: appData.dietRecords,
        trainingRecords: appData.trainingRecords,
        weightRecords: appData.weightRecords,
        userInfo: appData.userInfo
    }));
}

function loadUserData() {
    const userKey = `wancheng_data_${currentUser?.id || 'default'}`;
    const saved = localStorage.getItem(userKey);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            // 只更新指定字段，不覆盖 isPremium（由 checkPremiumStatus 单独管理）
            if (data.dietRecords !== undefined) appData.dietRecords = data.dietRecords;
            if (data.trainingRecords !== undefined) appData.trainingRecords = data.trainingRecords;
            if (data.weightRecords !== undefined) appData.weightRecords = data.weightRecords;
            if (data.userInfo !== undefined) appData.userInfo = data.userInfo;
        } catch(e) {}
    }
    
    const nicknameInput = document.getElementById('nickname');
    const genderSelect = document.getElementById('gender');
    const heightInput = document.getElementById('height');
    if (nicknameInput) nicknameInput.value = appData.userInfo.nickname || currentUser?.nickname || currentUser?.nickname || '';
    if (genderSelect) genderSelect.value = appData.userInfo.gender || '';
    if (heightInput) heightInput.value = appData.userInfo.height || '';
    
    if (appData.userInfo.avatar) {
        const userAvatar = document.getElementById('userAvatar');
        const avatarLarge = document.getElementById('avatarLarge');
        if (userAvatar) userAvatar.src = appData.userInfo.avatar;
        if (avatarLarge) avatarLarge.src = appData.userInfo.avatar;
    }
}

function checkPremiumStatus() {
    const expiry = localStorage.getItem(CONFIG.STORAGE_KEYS.PREMIUM_EXPIRY);
    if (expiry && new Date(expiry) < new Date()) {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.PREMIUM);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.PREMIUM_EXPIRY);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.PREMIUM_PLAN);
        appData.isPremium = false;
    } else {
        appData.isPremium = localStorage.getItem(CONFIG.STORAGE_KEYS.PREMIUM) === 'true';
    }
    updatePremiumUI();
}