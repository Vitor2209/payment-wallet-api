/**
 * Digital Wallet - Frontend JavaScript
 * Pure Vanilla JS implementation for fintech wallet application
 */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    API_BASE_URL: 'http://localhost:3000',
    ENDPOINTS: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        BALANCE: '/wallet/balance',
        DEPOSIT: '/wallet/deposit',
        TRANSFER: '/wallet/transfer',
        TRANSACTIONS: '/transactions'
    },
    TOKEN_KEY: 'token',
    PAGES: {
        LOGIN: 'index.html',
        REGISTER: 'register.html',
        DASHBOARD: 'dashboard.html'
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get auth token from localStorage
 */
function getToken() {
    return localStorage.getItem(CONFIG.TOKEN_KEY);
}

/**
 * Set auth token in localStorage
 */
function setToken(token) {
    localStorage.setItem(CONFIG.TOKEN_KEY, token);
}

/**
 * Remove auth token from localStorage
 */
function removeToken() {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return !!getToken();
}

/**
 * Redirect to a page
 */
function redirectTo(page) {
    window.location.href = page;
}

/**
 * Get current page name
 */
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    return page;
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    const num = parseFloat(amount) || 0;
    return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/**
 * Format date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}

/**
 * Show loading state on button
 */
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

/**
 * Show error message
 */
function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
    }
}

/**
 * Hide error message
 */
function hideError(elementId) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.classList.remove('show');
    }
}

/**
 * Show success message
 */
function showSuccess(elementId, message) {
    const successEl = document.getElementById(elementId);
    if (successEl) {
        successEl.textContent = message;
        successEl.classList.add('show');
    }
}

/**
 * Hide success message
 */
function hideSuccess(elementId) {
    const successEl = document.getElementById(elementId);
    if (successEl) {
        successEl.classList.remove('show');
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.className = 'toast ' + type;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Make API request
 */
async function apiRequest(endpoint, options = {}) {
    const url = CONFIG.API_BASE_URL + endpoint;
    const token = getToken();

    const defaultHeaders = {
        'Content-Type': 'application/json'
    };

    if (token) {
        defaultHeaders['Authorization'] = 'Bearer ' + token;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'Request failed');
        }

        return data;
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Unable to connect to server. Please check your connection.');
        }
        throw error;
    }
}

/**
 * Register new user
 */
async function registerUser(name, email, password) {
    return apiRequest(CONFIG.ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
    });
}

/**
 * Login user
 */
async function loginUser(email, password) {
    return apiRequest(CONFIG.ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

/**
 * Get wallet balance
 */
async function getBalance() {
    return apiRequest(CONFIG.ENDPOINTS.BALANCE, {
        method: 'GET'
    });
}

/**
 * Deposit funds
 */
async function depositFunds(amount) {
    return apiRequest(CONFIG.ENDPOINTS.DEPOSIT, {
        method: 'POST',
        body: JSON.stringify({ amount: parseFloat(amount) })
    });
}

/**
 * Transfer funds
 */
async function transferFunds(toUserId, amount) {
    return apiRequest(CONFIG.ENDPOINTS.TRANSFER, {
        method: 'POST',
        body: JSON.stringify({ toUserId, amount: parseFloat(amount) })
    });
}

/**
 * Get transactions
 */
async function getTransactions() {
    return apiRequest(CONFIG.ENDPOINTS.TRANSACTIONS, {
        method: 'GET'
    });
}

// ============================================
// PAGE HANDLERS
// ============================================

/**
 * Initialize Login Page
 */
function initLoginPage() {
    // Redirect if already authenticated
    if (isAuthenticated()) {
        redirectTo(CONFIG.PAGES.DASHBOARD);
        return;
    }

    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            hideError('error-message');
            setButtonLoading(submitBtn, true);

            try {
                const data = await loginUser(email, password);
                
                if (data.token) {
                    setToken(data.token);
                    redirectTo(CONFIG.PAGES.DASHBOARD);
                } else {
                    throw new Error('Invalid response from server');
                }
            } catch (error) {
                showError('error-message', error.message);
            } finally {
                setButtonLoading(submitBtn, false);
            }
        });
    }
}

/**
 * Initialize Register Page
 */
function initRegisterPage() {
    // Redirect if already authenticated
    if (isAuthenticated()) {
        redirectTo(CONFIG.PAGES.DASHBOARD);
        return;
    }

    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const submitBtn = registerForm.querySelector('button[type="submit"]');

            hideError('error-message');
            hideSuccess('success-message');
            setButtonLoading(submitBtn, true);

            try {
                await registerUser(name, email, password);
                showSuccess('success-message', 'Account created successfully! Redirecting to login...');
                
                setTimeout(() => {
                    redirectTo(CONFIG.PAGES.LOGIN);
                }, 2000);
            } catch (error) {
                showError('error-message', error.message);
            } finally {
                setButtonLoading(submitBtn, false);
            }
        });
    }
}

/**
 * Initialize Dashboard Page
 */
function initDashboardPage() {
    // Redirect if not authenticated
    if (!isAuthenticated()) {
        redirectTo(CONFIG.PAGES.LOGIN);
        return;
    }

    // Initialize all dashboard functionality
    initBalanceSection();
    initActionButtons();
    initModals();
    initDepositForm();
    initTransferForm();
    initLogout();
    
    // Load initial data
    loadBalance();
    loadTransactions();
}

/**
 * Initialize balance section
 */
function initBalanceSection() {
    const refreshBtn = document.getElementById('refresh-balance-btn');
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadBalance(true);
        });
    }
}

/**
 * Load and display balance
 */
async function loadBalance(showRefreshAnimation = false) {
    const balanceAmountEl = document.querySelector('#balance-amount .amount');
    const refreshBtn = document.getElementById('refresh-balance-btn');

    if (showRefreshAnimation && refreshBtn) {
        refreshBtn.classList.add('spinning');
    }

    try {
        const data = await getBalance();
        const balance = data.balance !== undefined ? data.balance : 0;
        
        if (balanceAmountEl) {
            balanceAmountEl.textContent = formatCurrency(balance);
        }
    } catch (error) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            removeToken();
            redirectTo(CONFIG.PAGES.LOGIN);
            return;
        }
        showToast('Failed to load balance', 'error');
    } finally {
        if (refreshBtn) {
            setTimeout(() => {
                refreshBtn.classList.remove('spinning');
            }, 500);
        }
    }
}

/**
 * Initialize action buttons
 */
function initActionButtons() {
    const depositBtn = document.getElementById('deposit-btn');
    const transferBtn = document.getElementById('transfer-btn');
    const transactionsBtn = document.getElementById('transactions-btn');
    const viewAllBtn = document.getElementById('view-all-btn');

    if (depositBtn) {
        depositBtn.addEventListener('click', () => openModal('deposit-modal'));
    }

    if (transferBtn) {
        transferBtn.addEventListener('click', () => openModal('transfer-modal'));
    }

    if (transactionsBtn) {
        transactionsBtn.addEventListener('click', () => {
            loadAllTransactions();
            openModal('transactions-modal');
        });
    }

    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            loadAllTransactions();
            openModal('transactions-modal');
        });
    }
}

/**
 * Initialize modals
 */
function initModals() {
    // Close buttons
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            if (modalId) {
                closeModal(modalId);
            }
        });
    });

    // Close on overlay click
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay.id);
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal-overlay.show');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });

    // Quick amount buttons
    const quickAmountBtns = document.querySelectorAll('.quick-amount-btn');
    quickAmountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = btn.getAttribute('data-amount');
            const depositAmountInput = document.getElementById('deposit-amount');
            
            if (depositAmountInput && amount) {
                depositAmountInput.value = amount;
                
                // Update selected state
                quickAmountBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            }
        });
    });
}

/**
 * Open modal
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close modal
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Reset form if exists
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }

        // Clear messages
        const errorMessages = modal.querySelectorAll('.error-message');
        const successMessages = modal.querySelectorAll('.success-message');
        
        errorMessages.forEach(el => el.classList.remove('show'));
        successMessages.forEach(el => el.classList.remove('show'));

        // Clear quick amount selection
        const quickAmountBtns = modal.querySelectorAll('.quick-amount-btn');
        quickAmountBtns.forEach(btn => btn.classList.remove('selected'));
    }
}

/**
 * Initialize deposit form
 */
function initDepositForm() {
    const depositForm = document.getElementById('deposit-form');
    
    if (depositForm) {
        depositForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const amount = document.getElementById('deposit-amount').value;
            const submitBtn = depositForm.querySelector('button[type="submit"]');

            hideError('deposit-error');
            hideSuccess('deposit-success');
            setButtonLoading(submitBtn, true);

            try {
                await depositFunds(amount);
                showSuccess('deposit-success', `Successfully deposited $${formatCurrency(amount)}`);
                showToast(`Deposited $${formatCurrency(amount)}`, 'success');
                
                // Refresh balance and transactions
                loadBalance();
                loadTransactions();
                
                // Close modal after delay
                setTimeout(() => {
                    closeModal('deposit-modal');
                }, 1500);
            } catch (error) {
                showError('deposit-error', error.message);
            } finally {
                setButtonLoading(submitBtn, false);
            }
        });
    }
}

/**
 * Initialize transfer form
 */
function initTransferForm() {
    const transferForm = document.getElementById('transfer-form');
    
    if (transferForm) {
        transferForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const toUserId = document.getElementById('recipient-id').value.trim();
            const amount = document.getElementById('transfer-amount').value;
            const submitBtn = transferForm.querySelector('button[type="submit"]');

            hideError('transfer-error');
            hideSuccess('transfer-success');
            setButtonLoading(submitBtn, true);

            try {
                await transferFunds(toUserId, amount);
                showSuccess('transfer-success', `Successfully transferred $${formatCurrency(amount)}`);
                showToast(`Transferred $${formatCurrency(amount)}`, 'success');
                
                // Refresh balance and transactions
                loadBalance();
                loadTransactions();
                
                // Close modal after delay
                setTimeout(() => {
                    closeModal('transfer-modal');
                }, 1500);
            } catch (error) {
                showError('transfer-error', error.message);
            } finally {
                setButtonLoading(submitBtn, false);
            }
        });
    }
}

/**
 * Initialize logout
 */
function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            removeToken();
            redirectTo(CONFIG.PAGES.LOGIN);
        });
    }
}

/**
 * Load and display recent transactions
 */
async function loadTransactions() {
    const transactionsList = document.getElementById('transactions-list');
    const emptyState = document.getElementById('empty-transactions');

    try {
        const data = await getTransactions();
        const transactions = Array.isArray(data) ? data : (data.transactions || []);
        
        // Sort by date (newest first)
        transactions.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
        
        // Show only recent 5 on dashboard
        const recentTransactions = transactions.slice(0, 5);

        if (transactionsList) {
            if (recentTransactions.length === 0) {
                if (emptyState) {
                    emptyState.style.display = 'block';
                }
            } else {
                if (emptyState) {
                    emptyState.style.display = 'none';
                }
                
                // Clear existing items (except empty state)
                const existingItems = transactionsList.querySelectorAll('.transaction-item');
                existingItems.forEach(item => item.remove());
                
                // Render transactions
                recentTransactions.forEach(transaction => {
                    const item = createTransactionItem(transaction);
                    transactionsList.appendChild(item);
                });
            }
        }
    } catch (error) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            removeToken();
            redirectTo(CONFIG.PAGES.LOGIN);
            return;
        }
        console.error('Failed to load transactions:', error);
    }
}

/**
 * Load all transactions in modal
 */
async function loadAllTransactions() {
    const allTransactionsList = document.getElementById('all-transactions-list');

    if (!allTransactionsList) return;

    // Show loading state
    allTransactionsList.innerHTML = '<div class="empty-state"><p>Loading transactions...</p></div>';

    try {
        const data = await getTransactions();
        const transactions = Array.isArray(data) ? data : (data.transactions || []);
        
        // Sort by date (newest first)
        transactions.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

        if (transactions.length === 0) {
            allTransactionsList.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 5H7C6.46957 5 5.96086 5.21071 5.58579 5.58579C5.21071 5.96086 5 6.46957 5 7V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V7C19 6.46957 18.7893 5.96086 18.4142 5.58579C18.0391 5.21071 17.5304 5 17 5H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 5C9 4.46957 9.21071 3.96086 9.58579 3.58579C9.96086 3.21071 10.4696 3 11 3H13C13.5304 3 14.0391 3.21071 14.4142 3.58579C14.7893 3.96086 15 4.46957 15 5C15 5.53043 14.7893 6.03914 14.4142 6.41421C14.0391 6.78929 13.5304 7 13 7H11C10.4696 7 9.96086 6.78929 9.58579 6.41421C9.21071 6.03914 9 5.53043 9 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p>No transactions yet</p>
                </div>
            `;
        } else {
            allTransactionsList.innerHTML = '';
            transactions.forEach(transaction => {
                const item = createTransactionItem(transaction);
                allTransactionsList.appendChild(item);
            });
        }
    } catch (error) {
        allTransactionsList.innerHTML = `
            <div class="empty-state">
                <p>Failed to load transactions</p>
            </div>
        `;
    }
}

/**
 * Create transaction item element
 */
function createTransactionItem(transaction) {
    const item = document.createElement('div');
    item.className = 'transaction-item';
    item.setAttribute('data-testid', 'transaction-item');

    const type = transaction.type || 'unknown';
    const amount = transaction.amount || 0;
    const date = transaction.createdAt || transaction.date || new Date().toISOString();
    
    // Determine if positive or negative
    let isPositive = false;
    let displayType = type;
    let iconClass = '';
    let iconSvg = '';

    if (type === 'deposit') {
        isPositive = true;
        displayType = 'Deposit';
        iconClass = 'deposit';
        iconSvg = `<svg viewBox="0 0 24 24" fill="none"><path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
    } else if (type === 'transfer_out' || type === 'transfer-out' || type === 'sent') {
        isPositive = false;
        displayType = 'Transfer Sent';
        iconClass = 'transfer-out';
        iconSvg = `<svg viewBox="0 0 24 24" fill="none"><path d="M17 1L21 5L17 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 11V9C3 7.93913 3.42143 6.92172 4.17157 6.17157C4.92172 5.42143 5.93913 5 7 5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    } else if (type === 'transfer_in' || type === 'transfer-in' || type === 'received') {
        isPositive = true;
        displayType = 'Transfer Received';
        iconClass = 'transfer-in';
        iconSvg = `<svg viewBox="0 0 24 24" fill="none"><path d="M7 23L3 19L7 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 13V15C21 16.0609 20.5786 17.0783 19.8284 17.8284C19.0783 18.5786 18.0609 19 17 19H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    } else if (type === 'transfer') {
        // Generic transfer - check if we have direction info
        if (transaction.direction === 'in' || transaction.fromUserId) {
            isPositive = true;
            displayType = 'Transfer Received';
            iconClass = 'transfer-in';
        } else {
            isPositive = false;
            displayType = 'Transfer Sent';
            iconClass = 'transfer-out';
        }
        iconSvg = `<svg viewBox="0 0 24 24" fill="none"><path d="M17 1L21 5L17 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 11V9C3 7.93913 3.42143 6.92172 4.17157 6.17157C4.92172 5.42143 5.93913 5 7 5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }

    item.innerHTML = `
        <div class="transaction-icon ${iconClass}">
            ${iconSvg}
        </div>
        <div class="transaction-details">
            <div class="transaction-type">${displayType}</div>
            <div class="transaction-date">${formatDate(date)}</div>
        </div>
        <div class="transaction-amount ${isPositive ? 'positive' : 'negative'}">
            ${isPositive ? '+' : '-'}$${formatCurrency(amount)}
        </div>
    `;

    return item;
}

// ============================================
// PAGE INITIALIZATION
// ============================================

/**
 * Initialize page based on current location
 */
function initPage() {
    const currentPage = getCurrentPage();

    switch (currentPage) {
        case 'index.html':
        case '':
            initLoginPage();
            break;
        case 'register.html':
            initRegisterPage();
            break;
        case 'dashboard.html':
            initDashboardPage();
            break;
        default:
            // Unknown page, redirect to login
            if (!isAuthenticated()) {
                redirectTo(CONFIG.PAGES.LOGIN);
            }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initPage);
