// src/main/resources/static/js/admin/admin-reports.js

class AdminReportsManager {
    constructor() {
        // Khởi tạo các thuộc tính cần thiết
        this.token = $("meta[name='_csrf']").attr("content");
        this.header = $("meta[name='_csrf_header']").attr("content");
        this.salesChart = null; // Biến lưu trữ đối tượng Chart.js
        this.chartCtx = document.getElementById('salesChart') ? document.getElementById('salesChart').getContext('2d') : null;

        // Khởi động các hàm chính
        this.init();
    }

    // --- Hàm định dạng tiền tệ ---
    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    // --- Hàm định dạng ngày tháng sang YYYY-MM-DD ---
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    // --- Hàm vẽ biểu đồ ---
    renderChart(monthlyData) {
        if (!this.chartCtx) return;

        // Hủy biểu đồ cũ nếu tồn tại
        if (this.salesChart) {
            this.salesChart.destroy();
        }

        const labels = monthlyData.map(item => item.monthYear);
        const revenues = monthlyData.map(item => item.revenue);
        const orders = monthlyData.map(item => item.orders);

        this.salesChart = new Chart(this.chartCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Doanh thu (VND)',
                        data: revenues,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Số lượng đơn hàng',
                        data: orders,
                        backgroundColor: 'rgba(153, 102, 255, 0.6)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1,
                        type: 'line', // Dùng line chart cho orders
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Doanh thu (VND)'
                        },
                        ticks: {
                            // Định dạng trục Y cho Doanh thu
                            callback: (value) => this.formatCurrency(value)
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Số lượng đơn hàng'
                        },
                        // grid line settings
                        grid: {
                            drawOnChartArea: false,
                        },
                        min: 0,
                        ticks: {
                            precision: 0 // Đảm bảo số đơn hàng là số nguyên
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.dataset.label.includes('Doanh thu')) {
                                    label += this.formatCurrency(context.parsed.y);
                                } else {
                                    label += context.parsed.y;
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // --- Hàm tải dữ liệu báo cáo ---
    loadReportData(startDate, endDate) {
        const url = `/admin/api/reports/sales-stats?startDate=${startDate}&endDate=${endDate}`;

        // Hiển thị trạng thái tải
        $('.report-value').html('<i class="fas fa-spinner fa-spin"></i> Đang tải...');

        $.ajax({
            url: url,
            type: 'GET',
            beforeSend: (xhr) => {
                xhr.setRequestHeader(this.header, this.token);
            },
            success: (response) => {
                // Định dạng và cập nhật các chỉ số chính
                const totalRevenue = parseFloat(response.totalRevenue);
                const totalOrders = response.totalOrders;
                const totalProductsSold = response.totalProductsSold;

                const averageOrderValue = totalOrders > 0
                    ? totalRevenue / totalOrders
                    : 0;

                $('#totalRevenue').text(this.formatCurrency(totalRevenue));
                $('#totalOrders').text(totalOrders.toLocaleString('vi-VN'));
                $('#averageOrderValue').text(this.formatCurrency(averageOrderValue));
                $('#totalProductsSold').text(totalProductsSold.toLocaleString('vi-VN'));

                // Vẽ biểu đồ
                this.renderChart(response.monthlySales);

                // Cập nhật khoảng thời gian hiển thị
                $('#reportRange').text(`Thời gian: ${startDate} đến ${endDate}`);
            },
            error: (xhr, status, error) => {
                console.error("Lỗi khi tải báo cáo:", error);
                alert("Lỗi khi tải dữ liệu báo cáo. Vui lòng kiểm tra console hoặc log server.");
                $('#totalRevenue').text('Lỗi');
                $('#totalOrders').text('Lỗi');
                $('#averageOrderValue').text('Lỗi');
                $('#totalProductsSold').text('Lỗi');
            }
        });
    }

    // --- Thiết lập Event Listener ---
    setupEventListeners() {
        $('#applyFilter').on('click', () => {
            const startDate = $('#startDate').val();
            const endDate = $('#endDate').val();

            if (startDate && endDate) {
                this.loadReportData(startDate, endDate);
            } else {
                alert("Vui lòng chọn cả Ngày Bắt Đầu và Ngày Kết Thúc.");
            }
        });
    }

    // --- Phương thức khởi tạo chính ---
    init() {
        // 1. Thiết lập Event Listeners
        this.setupEventListeners();

        // 2. Thiết lập ngày mặc định (6 tháng trước đến hôm nay)
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 6);
        sixMonthsAgo.setDate(1); // Set về ngày 1 của tháng đó để báo cáo dễ hiểu hơn

        const defaultStartDate = this.formatDate(sixMonthsAgo);
        const defaultEndDate = this.formatDate(today);

        // Thiết lập giá trị mặc định cho Datepicker
        $('#startDate').val(defaultStartDate);
        $('#endDate').val(defaultEndDate);

        // 3. Tải dữ liệu lần đầu
        this.loadReportData(defaultStartDate, defaultEndDate);
    }
}

// Khởi tạo class khi DOM đã sẵn sàng
$(document).ready(function() {
    new AdminReportsManager();
});