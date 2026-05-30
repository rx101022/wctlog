let alertCallback = null, confirmCallback = null, promptCallback = null, numberCallback = null, selectCallback = null;

function initModals() {
    const alertModal = document.getElementById('customAlertModal');
    const alertConfirmBtn = document.getElementById('alertConfirmBtn');
    if (alertConfirmBtn) alertConfirmBtn.onclick = () => { alertModal.classList.remove('active'); if (alertCallback) { alertCallback(); alertCallback = null; } };
    
    const confirmModal = document.getElementById('customConfirmModal');
    const confirmOkBtn = document.getElementById('confirmOkBtn');
    const confirmCancelBtn = document.getElementById('confirmCancelBtn');
    if (confirmOkBtn) confirmOkBtn.onclick = () => { confirmModal.classList.remove('active'); if (confirmCallback) { confirmCallback(true); confirmCallback = null; } };
    if (confirmCancelBtn) confirmCancelBtn.onclick = () => { confirmModal.classList.remove('active'); if (confirmCallback) { confirmCallback(false); confirmCallback = null; } };
    
    const promptModal = document.getElementById('customPromptModal');
    const promptOkBtn = document.getElementById('promptOkBtn');
    const promptCancelBtn = document.getElementById('promptCancelBtn');
    const promptInput = document.getElementById('promptInput');
    if (promptOkBtn) promptOkBtn.onclick = () => { const value = promptInput.value; promptModal.classList.remove('active'); promptInput.value = ''; if (promptCallback) { promptCallback(value); promptCallback = null; } };
    if (promptCancelBtn) promptCancelBtn.onclick = () => { promptModal.classList.remove('active'); promptInput.value = ''; if (promptCallback) { promptCallback(null); promptCallback = null; } };
    
    const numberModal = document.getElementById('customNumberModal');
    const numberOkBtn = document.getElementById('numberOkBtn');
    const numberCancelBtn = document.getElementById('numberCancelBtn');
    const numberInput = document.getElementById('numberInput');
    if (numberOkBtn) numberOkBtn.onclick = () => { const value = numberInput.value; numberModal.classList.remove('active'); numberInput.value = ''; if (numberCallback) { numberCallback(value); numberCallback = null; } };
    if (numberCancelBtn) numberCancelBtn.onclick = () => { numberModal.classList.remove('active'); numberInput.value = ''; if (numberCallback) { numberCallback(null); numberCallback = null; } };
    
    const selectModal = document.getElementById('customSelectModal');
    const selectCancelBtn = document.getElementById('selectCancelBtn');
    if (selectCancelBtn) selectCancelBtn.onclick = () => { selectModal.classList.remove('active'); if (selectCallback) { selectCallback(null); selectCallback = null; } };
}

function customAlert(message, callback) {
    const modal = document.getElementById('customAlertModal');
    const msgEl = document.getElementById('alertMessage');
    if (msgEl) msgEl.innerText = message;
    alertCallback = callback;
    modal.classList.add('active');
}

function customConfirm(message, callback) {
    const modal = document.getElementById('customConfirmModal');
    const msgEl = document.getElementById('confirmMessage');
    if (msgEl) msgEl.innerText = message;
    confirmCallback = callback;
    modal.classList.add('active');
}

function customPrompt(title, message, placeholder, callback) {
    const modal = document.getElementById('customPromptModal');
    const titleEl = document.getElementById('promptTitle');
    const msgEl = document.getElementById('promptMessage');
    const inputEl = document.getElementById('promptInput');
    if (titleEl) titleEl.innerText = title;
    if (msgEl) msgEl.innerText = message;
    if (inputEl) inputEl.placeholder = placeholder || '';
    promptCallback = callback;
    modal.classList.add('active');
}

function customNumber(title, message, placeholder, callback) {
    const modal = document.getElementById('customNumberModal');
    const titleEl = document.getElementById('numberTitle');
    const msgEl = document.getElementById('numberMessage');
    const inputEl = document.getElementById('numberInput');
    if (titleEl) titleEl.innerText = title;
    if (msgEl) msgEl.innerText = message;
    if (inputEl) inputEl.placeholder = placeholder || '';
    numberCallback = callback;
    modal.classList.add('active');
}

function customSelect(title, options, callback) {
    const modal = document.getElementById('customSelectModal');
    const titleEl = document.getElementById('selectTitle');
    const optionsDiv = document.getElementById('selectOptions');
    if (titleEl) titleEl.innerText = title;
    if (optionsDiv) {
        // 支持两种格式：字符串数组 ['早餐'] 或对象数组 [{value, label}]
        const items = options.map(opt => typeof opt === 'string' ? { value: opt, label: opt } : opt);
        optionsDiv.innerHTML = items.map(item => `<div class="select-option" data-value="${item.value}">${item.label}</div>`).join('');
        optionsDiv.querySelectorAll('.select-option').forEach(el => { el.onclick = () => { modal.classList.remove('active'); if (selectCallback) { selectCallback(el.dataset.value); selectCallback = null; } }; });
    }
    selectCallback = callback;
    modal.classList.add('active');
}

document.addEventListener('DOMContentLoaded', initModals);