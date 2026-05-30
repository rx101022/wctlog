function initDateDisplay() {
    const today = new Date();
    const dd = document.getElementById('dateDisplay');
    const cm = document.getElementById('currentMonth');
    if (dd) dd.innerText = `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日`;
    if (cm) cm.innerText = `${today.getFullYear()}年${today.getMonth()+1}月`;
}

function switchToPage(pageName) {
    // 切换顶部导航高亮
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageName);
    });
    // 切换底部导航高亮（移动端）
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageName);
    });
    // 切换页面显示
    document.querySelectorAll('.page').forEach(page => {
        page.classList.toggle('active', page.id === pageName + 'Page');
    });
    // 如果切换到饮食页面，刷新日期显示
    if (pageName === 'diet') {
        initDateDisplay();
    }
    // 如果切换到日志页面，可能需要刷新日历
    if (pageName === 'record') {
        renderRecordPage();
    }
}

function init() {
    initAuth();
    initDateDisplay();
    bindAuthEvents();
}

document.addEventListener('DOMContentLoaded', init);