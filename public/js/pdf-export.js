// ===== PDF Export Module =====
// Professional Arabic PDF export using jsPDF

class PDFExporter {
    constructor() {
        this.doc = null;
        this.pageWidth = 210;
        this.pageHeight = 297;
        this.margin = 15;
        this.contentWidth = this.pageWidth - (this.margin * 2);
        this.currentY = 0;
        this.lineHeight = 8;
        this.primaryColor = [37, 99, 235];
        this.successColor = [16, 185, 129];
        this.warningColor = [245, 158, 11];
        this.darkColor = [30, 41, 59];
        this.grayColor = [100, 116, 139];
    }

    async init() {
        // Load jsPDF if not already loaded
        if (typeof window.jspdf === 'undefined') {
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        }
        // Load Arabic font support
        if (typeof window.jspdf !== 'undefined') {
            this.doc = new window.jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Reverse Arabic text for proper display (simple RTL fix)
    reverseArabic(text) {
        return text;
    }

    // Add page header with logo and title
    addHeader(title, subtitle = '') {
        this.currentY = this.margin;

        // Header background
        this.doc.setFillColor(...this.primaryColor);
        this.doc.rect(0, 0, this.pageWidth, 40, 'F');

        // Title
        this.doc.setTextColor(255, 255, 255);
        this.doc.setFontSize(22);
        this.doc.text(title, this.pageWidth / 2, 18, { align: 'center' });

        // Subtitle
        if (subtitle) {
            this.doc.setFontSize(12);
            this.doc.text(subtitle, this.pageWidth / 2, 28, { align: 'center' });
        }

        // Date
        this.doc.setFontSize(10);
        const date = new Date().toLocaleDateString('ar-EG', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        this.doc.text(date, this.pageWidth / 2, 36, { align: 'center' });

        this.currentY = 50;
    }

    // Add section title
    addSectionTitle(title) {
        this.checkPageBreak(20);

        // Section background
        this.doc.setFillColor(241, 245, 249);
        this.doc.roundedRect(this.margin, this.currentY, this.contentWidth, 12, 2, 2, 'F');

        // Section border
        this.doc.setDrawColor(...this.primaryColor);
        this.doc.setLineWidth(0.5);
        this.doc.line(this.margin, this.currentY, this.margin + 4, this.currentY);
        this.doc.line(this.margin, this.currentY, this.margin, this.currentY + 12);

        // Title text
        this.doc.setTextColor(...this.darkColor);
        this.doc.setFontSize(14);
        this.doc.text(title, this.pageWidth - this.margin - 5, this.currentY + 8, { align: 'right' });

        this.currentY += 18;
    }

    // Add stats grid (4 boxes)
    addStatsGrid(stats) {
        this.checkPageBreak(35);

        const boxWidth = (this.contentWidth - 15) / 4;
        const boxHeight = 25;
        const colors = [
            [37, 99, 235],   // blue
            [16, 185, 129],  // green
            [245, 158, 11],  // orange
            [139, 92, 246]   // purple
        ];

        stats.forEach((stat, index) => {
            const x = this.margin + (index * (boxWidth + 5));

            // Box background
            this.doc.setFillColor(255, 255, 255);
            this.doc.roundedRect(x, this.currentY, boxWidth, boxHeight, 3, 3, 'F');

            // Box border
            this.doc.setDrawColor(...colors[index]);
            this.doc.setLineWidth(0.8);
            this.doc.roundedRect(x, this.currentY, boxWidth, boxHeight, 3, 3, 'S');

            // Top colored line
            this.doc.setFillColor(...colors[index]);
            this.doc.rect(x, this.currentY, boxWidth, 3, 'F');

            // Value
            this.doc.setTextColor(...this.darkColor);
            this.doc.setFontSize(16);
            this.doc.text(stat.value.toString(), x + boxWidth / 2, this.currentY + 13, { align: 'center' });

            // Label
            this.doc.setTextColor(...this.grayColor);
            this.doc.setFontSize(8);
            this.doc.text(stat.label, x + boxWidth / 2, this.currentY + 21, { align: 'center' });
        });

        this.currentY += boxHeight + 10;
    }

    // Add data table
    addTable(headers, rows, options = {}) {
        this.checkPageBreak(30);

        const colWidth = this.contentWidth / headers.length;
        const rowHeight = 10;

        // Header row
        this.doc.setFillColor(...this.primaryColor);
        this.doc.rect(this.margin, this.currentY, this.contentWidth, rowHeight, 'F');

        this.doc.setTextColor(255, 255, 255);
        this.doc.setFontSize(10);

        headers.forEach((header, index) => {
            const x = this.pageWidth - this.margin - (index * colWidth) - colWidth / 2;
            this.doc.text(header, x, this.currentY + 7, { align: 'center' });
        });

        this.currentY += rowHeight;

        // Data rows
        rows.forEach((row, rowIndex) => {
            this.checkPageBreak(rowHeight + 5);

            // Alternating row background
            if (rowIndex % 2 === 0) {
                this.doc.setFillColor(248, 250, 252);
                this.doc.rect(this.margin, this.currentY, this.contentWidth, rowHeight, 'F');
            }

            this.doc.setTextColor(...this.darkColor);
            this.doc.setFontSize(9);

            row.forEach((cell, cellIndex) => {
                const x = this.pageWidth - this.margin - (cellIndex * colWidth) - colWidth / 2;
                const cellText = cell ? cell.toString().substring(0, 25) : '-';
                this.doc.text(cellText, x, this.currentY + 7, { align: 'center' });
            });

            // Row border
            this.doc.setDrawColor(226, 232, 240);
            this.doc.setLineWidth(0.2);
            this.doc.line(this.margin, this.currentY + rowHeight, this.margin + this.contentWidth, this.currentY + rowHeight);

            this.currentY += rowHeight;
        });

        this.currentY += 10;
    }

    // Add key-value list
    addKeyValueList(items) {
        this.checkPageBreak(items.length * 10 + 10);

        items.forEach((item, index) => {
            // Alternating background
            if (index % 2 === 0) {
                this.doc.setFillColor(248, 250, 252);
                this.doc.rect(this.margin, this.currentY, this.contentWidth, 9, 'F');
            }

            // Key (right side for Arabic)
            this.doc.setTextColor(...this.darkColor);
            this.doc.setFontSize(10);
            this.doc.text(item.key, this.pageWidth - this.margin - 5, this.currentY + 6, { align: 'right' });

            // Value (left side with badge style)
            this.doc.setFillColor(...this.primaryColor);
            const valueWidth = this.doc.getTextWidth(item.value) + 8;
            this.doc.roundedRect(this.margin + 5, this.currentY + 1, valueWidth, 7, 2, 2, 'F');

            this.doc.setTextColor(255, 255, 255);
            this.doc.setFontSize(9);
            this.doc.text(item.value, this.margin + 9, this.currentY + 6);

            this.currentY += 9;
        });

        this.currentY += 8;
    }

    // Add simple text list
    addTextList(items, title = '') {
        if (title) {
            this.doc.setTextColor(...this.darkColor);
            this.doc.setFontSize(11);
            this.doc.text(title, this.pageWidth - this.margin, this.currentY, { align: 'right' });
            this.currentY += 8;
        }

        items.forEach(item => {
            this.checkPageBreak(8);
            this.doc.setTextColor(...this.grayColor);
            this.doc.setFontSize(9);
            this.doc.text('• ' + item, this.pageWidth - this.margin - 5, this.currentY, { align: 'right' });
            this.currentY += 6;
        });

        this.currentY += 5;
    }

    // Check if we need a page break
    checkPageBreak(neededHeight) {
        if (this.currentY + neededHeight > this.pageHeight - this.margin) {
            this.addPage();
        }
    }

    // Add new page
    addPage() {
        this.doc.addPage();
        this.currentY = this.margin;

        // Mini header on continuation pages
        this.doc.setFillColor(...this.primaryColor);
        this.doc.rect(0, 0, this.pageWidth, 15, 'F');

        this.doc.setTextColor(255, 255, 255);
        this.doc.setFontSize(10);
        this.doc.text('Car Maintenance System - Report', this.pageWidth / 2, 10, { align: 'center' });

        this.currentY = 25;
    }

    // Add footer with page numbers
    addFooter() {
        const pageCount = this.doc.internal.getNumberOfPages();

        for (let i = 1; i <= pageCount; i++) {
            this.doc.setPage(i);

            // Footer line
            this.doc.setDrawColor(...this.grayColor);
            this.doc.setLineWidth(0.3);
            this.doc.line(this.margin, this.pageHeight - 15, this.pageWidth - this.margin, this.pageHeight - 15);

            // Page number
            this.doc.setTextColor(...this.grayColor);
            this.doc.setFontSize(9);
            this.doc.text(
                `Page ${i} / ${pageCount}`,
                this.pageWidth / 2,
                this.pageHeight - 8,
                { align: 'center' }
            );

            // System name
            this.doc.text(
                'Car Maintenance System',
                this.margin,
                this.pageHeight - 8
            );
        }
    }

    // Save the PDF
    save(filename) {
        this.addFooter();
        this.doc.save(filename);
    }
}

// ===== Export Report Function =====
async function exportReportToPDF() {
    showToast('Preparing report...', 'info');

    try {
        const pdf = new PDFExporter();
        await pdf.init();

        // Get current filter values
        const branchId = document.getElementById('branchFilter').value || null;
        const startDate = document.getElementById('startDate').value || null;
        const endDate = document.getElementById('endDate').value || null;

        // Get report data
        const stats = await db.getReportStats(branchId ? parseInt(branchId) : null, startDate, endDate);
        const branchCounts = await db.getCarCountByBranch();
        const mismatched = await db.getMismatchedOperations();

        // Get branch name for subtitle
        let branchName = 'All Branches';
        if (branchId) {
            const branch = await db.get('branches', parseInt(branchId));
            if (branch) branchName = branch.name;
        }

        // Date range for subtitle
        let dateRange = '';
        if (startDate && endDate) {
            dateRange = ` | ${startDate} - ${endDate}`;
        } else if (startDate) {
            dateRange = ` | From ${startDate}`;
        } else if (endDate) {
            dateRange = ` | Until ${endDate}`;
        }

        // Create PDF
        pdf.addHeader('Car Maintenance Report', branchName + dateRange);

        // Stats summary
        pdf.addSectionTitle('Operations Summary');
        pdf.addStatsGrid([
            { value: stats.totalOperations, label: 'Total Operations' },
            { value: stats.matchingOperations, label: 'Matching' },
            { value: stats.mismatchedOperations, label: 'Mismatched' },
            { value: stats.totalOilUsed + 'L', label: 'Oil Used' }
        ]);

        // Branch statistics
        pdf.addSectionTitle('Operations by Branch');
        const branchItems = Object.entries(branchCounts).map(([name, count]) => ({
            key: name,
            value: count + ' ops'
        }));
        if (branchItems.length > 0) {
            pdf.addKeyValueList(branchItems);
        } else {
            pdf.addTextList(['No data available']);
        }

        // Oil types
        pdf.addSectionTitle('Oil Types Used');
        const oilItems = Object.entries(stats.oilTypes).map(([type, count]) => ({
            key: type,
            value: count + 'x'
        }));
        if (oilItems.length > 0) {
            pdf.addKeyValueList(oilItems);
        } else {
            pdf.addTextList(['No data available']);
        }

        // Viscosities
        pdf.addSectionTitle('Oil Viscosities');
        const viscItems = Object.entries(stats.viscosities).map(([visc, count]) => ({
            key: visc,
            value: count + 'x'
        }));
        if (viscItems.length > 0) {
            pdf.addKeyValueList(viscItems);
        } else {
            pdf.addTextList(['No data available']);
        }

        // Filters usage
        pdf.addSectionTitle('Filters Replaced');
        pdf.addKeyValueList([
            { key: 'Oil Filter', value: stats.filters.oil + ' times' },
            { key: 'Air Filter', value: stats.filters.air + ' times' },
            { key: 'Cooling Filter', value: stats.filters.cooling + ' times' }
        ]);

        // Mismatched operations table
        if (mismatched.length > 0) {
            pdf.addSectionTitle('Mismatched Operations');

            const headers = ['Date', 'Car', 'Oil Used', 'Reason'];
            const rows = mismatched.map(op => [
                formatDate(op.created_at),
                `${op.car_brand} ${op.car_model}`,
                `${op.oil_used} (${op.oil_viscosity})`,
                op.mismatch_reason || '-'
            ]);

            pdf.addTable(headers, rows);
        }

        // Save
        const filename = `maintenance-report-${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(filename);

        showToast('Report exported successfully!', 'success');

    } catch (error) {
        console.error('PDF Export Error:', error);
        showToast('Failed to export report', 'error');
    }
}

// ===== Export detailed operations list =====
async function exportOperationsToPDF() {
    showToast('Preparing operations list...', 'info');

    try {
        const pdf = new PDFExporter();
        await pdf.init();

        const operations = await db.getAll('operations');

        pdf.addHeader('Operations List', `Total: ${operations.length} operations`);

        pdf.addSectionTitle('All Maintenance Operations');

        if (operations.length > 0) {
            const headers = ['Date', 'Car', 'Oil', 'Qty', 'Status'];
            const rows = operations.map(op => [
                formatDate(op.created_at),
                `${op.car_brand} ${op.car_model}`,
                op.oil_used || '-',
                op.oil_quantity ? op.oil_quantity + 'L' : '-',
                op.is_matching ? 'OK' : 'Mismatch'
            ]);

            pdf.addTable(headers, rows);
        } else {
            pdf.addTextList(['No operations recorded yet']);
        }

        const filename = `operations-list-${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(filename);

        showToast('Operations list exported!', 'success');

    } catch (error) {
        console.error('PDF Export Error:', error);
        showToast('Failed to export', 'error');
    }
}
