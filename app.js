// 客户数据存储
let customers = JSON.parse(localStorage.getItem('waterFilterCustomers')) || [];
let showAll = false; // 是否显示所有客户

// DOM元素
const customerNameInput = document.getElementById('customerName');
const machinePurchaseDateInput = document.getElementById('machinePurchaseDate');
const filterPurchaseDateInput = document.getElementById('filterPurchaseDate');
const addCustomerBtn = document.getElementById('addCustomer');
const reminderList = document.getElementById('reminderList');
const showAllCheckbox = document.getElementById('showAll');

// 初始化：设置默认日期为今天
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    machinePurchaseDateInput.value = today;
    filterPurchaseDateInput.value = today;
    
    // 加载客户数据
    loadCustomers();
    renderReminderList();
    
    // 监听显示所有客户复选框
    showAllCheckbox.addEventListener('change', () => {
        showAll = showAllCheckbox.checked;
        renderReminderList();
    });
});

// 从localStorage加载客户数据
function loadCustomers() {
    const storedCustomers = localStorage.getItem('waterFilterCustomers');
    if (storedCustomers) {
        customers = JSON.parse(storedCustomers);
    }
}

// 添加新客户
addCustomerBtn.addEventListener('click', () => {
    const name = customerNameInput.value.trim();
    const machineDate = machinePurchaseDateInput.value;
    const filterDate = filterPurchaseDateInput.value;
    
    if (!name || !machineDate || !filterDate) {
        alert('请填写所有字段');
        return;
    }
    
    const newCustomer = {
        name,
        machinePurchaseDate: machineDate,
        filterPurchaseDate: filterDate
    };
    
    customers.push(newCustomer);
    saveCustomers();
    renderReminderList();
    
    // 清空表单
    customerNameInput.value = '';
    machinePurchaseDateInput.value = new Date().toISOString().split('T')[0];
    filterPurchaseDateInput.value = new Date().toISOString().split('T')[0];
});

// 导入CSV数据
document.getElementById('importBtn').addEventListener('click', () => {
    const fileInput = document.getElementById('csvFile');
    const statusDiv = document.getElementById('importStatus');
    
    if (!fileInput.files.length) {
        statusDiv.textContent = '请选择CSV文件';
        statusDiv.style.color = '#e74c3c';
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const content = e.target.result;
        const lines = content.split('\n').filter(line => line.trim() !== '');
        let importedCount = 0;
        let skippedCount = 0;
        
        // 检测标题行
        const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
        const nameIndex = headers.findIndex(header => header.includes('客户名称') || header.includes('name'));
        const machineDateIndex = headers.findIndex(header => header.includes('饮水机购买日期') || header.includes('machine'));
        const filterDateIndex = headers.findIndex(header => header.includes('滤芯购买日期') || header.includes('filter'));
        
        // 验证必要的列是否存在
        if (nameIndex === -1 || machineDateIndex === -1 || filterDateIndex === -1) {
            statusDiv.textContent = 'CSV文件缺少必要的列: 需要客户名称,饮水机购买日期,滤芯购买日期';
            statusDiv.style.color = '#e74c3c';
            return;
        }
        
        // 从第二行开始处理数据
        for (let i = 1; i < lines.length; i++) {
            const columns = lines[i].split(',').map(item => item.trim());
            const name = columns[nameIndex];
            const machineDateStr = columns[machineDateIndex];
            const filterDateStr = columns[filterDateIndex];
            
            // 解析日期
            const parseDate = (dateStr) => {
                // 尝试多种日期格式
                const formats = [
                    /^(\d{4})[-/](\d{2})[-/](\d{2})$/, // YYYY-MM-DD 或 YYYY/MM/DD
                    /^(\d{2})[-/](\d{2})[-/](\d{4})$/, // MM-DD-YYYY 或 MM/DD/YYYY
                ];
                
                for (const format of formats) {
                    const match = dateStr.match(format);
                    if (match) {
                        if (format === formats[0]) {
                            return `${match[1]}-${match[2]}-${match[3]}`;
                        } else if (format === formats[1]) {
                            return `${match[3]}-${match[1]}-${match[2]}`;
                        }
                    }
                }
                return null;
            };
            
            const machineDate = parseDate(machineDateStr);
            const filterDate = parseDate(filterDateStr);
            
            // 验证数据
            if (name && machineDate && filterDate) {
                customers.push({
                    name,
                    machinePurchaseDate: machineDate,
                    filterPurchaseDate: filterDate
                });
                importedCount++;
            } else {
                skippedCount++;
            }
        }
        
        saveCustomers();
        renderReminderList();
        statusDiv.textContent = `导入完成: 成功导入 ${importedCount} 条记录，跳过 ${skippedCount} 条无效记录`;
        statusDiv.style.color = '#27ae60';
        
        // 清空文件选择
        fileInput.value = '';
    };
    
    reader.onerror = () => {
        statusDiv.textContent = '读取文件失败，请重试';
        statusDiv.style.color = '#e74c3c';
    };
    
    reader.readAsText(file);
});

// 下载示例CSV
document.getElementById('downloadSample').addEventListener('click', (e) => {
    e.preventDefault();
    const csvContent = "客户名称,饮水机购买日期,滤芯购买日期\n张三,2025-01-15,2025-01-15\n李四,2025/02/20,2025/02/20\n王五,03/15/2025,03/15/2025";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', '客户数据示例.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// 导出客户数据
document.getElementById('exportBtn').addEventListener('click', () => {
    if (customers.length === 0) {
        alert('没有客户数据可导出');
        return;
    }
    
    // 创建CSV内容
    let csvContent = '客户名称,饮水机购买日期,滤芯购买日期\n';
    
    customers.forEach(customer => {
        csvContent += `${customer.name},${customer.machinePurchaseDate},${customer.filterPurchaseDate}\n`;
    });
    
    // 创建下载链接
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `滤芯客户数据_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// 保存客户数据到localStorage
function saveCustomers() {
    localStorage.setItem('waterFilterCustomers', JSON.stringify(customers));
}

// 计算提醒日期范围
function calculateReminderRange(filterDate) {
    const date = new Date(filterDate);
    
    // 计算4个月后的日期
    const minDate = new Date(date);
    minDate.setMonth(minDate.getMonth() + 4);
    
    // 计算6个月后的日期
    const maxDate = new Date(date);
    maxDate.setMonth(maxDate.getMonth() + 6);
    
    return {
        min: formatDate(minDate),
        max: formatDate(maxDate)
    };
}

// 格式化日期为YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 渲染提醒列表
function renderReminderList() {
    reminderList.innerHTML = '';
    
    if (customers.length === 0) {
        reminderList.innerHTML = '<p>暂无客户记录</p>';
        return;
    }
    
    // 根据showAll标志过滤客户
    const filteredCustomers = showAll ? customers : customers.filter(customer => {
        const reminderRange = calculateReminderRange(customer.filterPurchaseDate);
        const today = new Date();
        const minReminderDate = new Date(reminderRange.min);
        return today >= minReminderDate;
    });
    
    if (filteredCustomers.length === 0) {
        reminderList.innerHTML = showAll ? '<p>暂无客户记录</p>' : '<p>暂无待跟进客户</p>';
        return;
    }
    
    filteredCustomers.forEach((customer, index) => {
        const reminderRange = calculateReminderRange(customer.filterPurchaseDate);
        const item = document.createElement('div');
        item.className = 'reminder-item';
        item.innerHTML = `
            <div class="customer-header">
                <h3>${customer.name}</h3>
                <button class="delete-btn" data-index="${index}">删除</button>
            </div>
            <div class="reminder-dates">
                <p>饮水机购买日期: ${customer.machinePurchaseDate}</p>
                <p>滤芯购买日期: ${customer.filterPurchaseDate}</p>
            </div>
            <p class="reminder-range">建议跟进时间: ${reminderRange.min} 至 ${reminderRange.max}</p>
        `;
        reminderList.appendChild(item);
    });
    
    // 添加删除按钮事件监听
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            deleteCustomer(index);
        });
    });
}

// 删除客户
function deleteCustomer(index) {
    if (confirm('确定要删除这个客户吗？')) {
        customers.splice(index, 1);
        saveCustomers();
        renderReminderList();
    }
}
