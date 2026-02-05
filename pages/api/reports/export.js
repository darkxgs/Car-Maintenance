import sql from '../../../lib/db';
import ExcelJS from 'exceljs';

/**
 * GET /api/reports/export
 * Export operations to Excel or CSV
 */
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {
            format = 'xlsx',
            search = '',
            sortBy = 'created_at',
            sortOrder = 'desc',
            branchId,
            startDate,
            endDate,
            isMatching
        } = req.query;

        // Build filtering conditions dynamically
        const conditions = [];

        if (branchId) {
            conditions.push(sql`o.branch_id = ${parseInt(branchId)}`);
        }

        if (startDate) {
            conditions.push(sql`DATE(o.created_at) >= ${startDate}`);
        }

        if (endDate) {
            conditions.push(sql`DATE(o.created_at) <= ${endDate}`);
        }

        if (isMatching !== undefined && isMatching !== null && isMatching !== '') {
            conditions.push(sql`o.is_matching = ${parseInt(isMatching)}`);
        }

        if (search && search.trim()) {
            const searchTerm = `%${search.trim()}%`;
            conditions.push(sql`(
                o.car_brand ILIKE ${searchTerm} OR
                o.car_model ILIKE ${searchTerm} OR
                o.oil_used ILIKE ${searchTerm} OR
                o.oil_viscosity ILIKE ${searchTerm} OR
                o.engine_size ILIKE ${searchTerm} OR
                CAST(o.car_year AS TEXT) LIKE ${searchTerm}
            )`);
        }

        // Combine conditions
        const whereClause = conditions.length > 0
            ? conditions.reduce((acc, curr, i) => i === 0 ? sql`WHERE ${curr}` : sql`${acc} AND ${curr}`, sql``)
            : sql``;

        // Safe sort column mapping
        let sortColumnFragment;
        switch (sortBy) {
            case 'car_brand': sortColumnFragment = sql`o.car_brand`; break;
            case 'car_model': sortColumnFragment = sql`o.car_model`; break;
            case 'car_year': sortColumnFragment = sql`o.car_year`; break;
            default: sortColumnFragment = sql`o.created_at`;
        }

        const sortOrderFragment = sortOrder.toLowerCase() === 'asc' ? sql`ASC` : sql`DESC`;

        // Fetch data with branch names
        const operations = await sql`
            SELECT 
                o.*,
                b.name as branch_name
            FROM operations o
            LEFT JOIN branches b ON o.branch_id = b.id
            ${whereClause}
            ORDER BY ${sortColumnFragment} ${sortOrderFragment}
        `;

        if (format === 'csv') {
            const csvContent = generateCSV(operations);
            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', 'attachment; filename=operations_report.csv');
            return res.status(200).send(csvContent);
        } else {
            // Default to Excel
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Operations Report');

            // Set RTL (Right-to-Left) view
            sheet.views = [{ rightToLeft: true }];

            // Define columns
            sheet.columns = [
                { header: 'معرف العملية', key: 'id', width: 10 },
                { header: 'التاريخ', key: 'created_at', width: 20 },
                { header: 'الفرع', key: 'branch_name', width: 20 },
                { header: 'السيارة', key: 'car', width: 30 },
                { header: 'سنة الصنع', key: 'car_year', width: 10 },
                { header: 'حجم المحرك', key: 'engine_size', width: 15 },
                { header: 'نوع الزيت', key: 'oil_used', width: 25 },
                { header: 'اللزوجة', key: 'oil_viscosity', width: 15 },
                { header: 'الكمية (لتر)', key: 'oil_quantity', width: 15 },
                { header: 'عداد الكيلومترات', key: 'mileage', width: 15 },
                { header: 'الحالة', key: 'is_matching', width: 15 },
                { header: 'سبب عدم المطابقة', key: 'mismatch_reason', width: 30 },
                { header: 'الملاحظات', key: 'notes', width: 30 }
            ];

            // Style header row
            const headerRow = sheet.getRow(1);
            headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            headerRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF2563EB' }
            };
            headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

            // Add data
            operations.forEach(op => {
                const row = sheet.addRow({
                    id: op.id,
                    created_at: new Date(op.created_at).toLocaleString('ar-EG'),
                    branch_name: op.branch_name || '-',
                    car: `${op.car_brand} ${op.car_model}`,
                    car_year: op.car_year,
                    engine_size: op.engine_size,
                    oil_used: op.oil_used,
                    oil_viscosity: op.oil_viscosity,
                    oil_quantity: op.oil_quantity,
                    mileage: op.mileage || '-',
                    is_matching: op.is_matching ? 'مطابق' : 'غير مطابق',
                    mismatch_reason: op.mismatch_reason || '-',
                    notes: op.notes || '-'
                });

                // Style mismatch rows
                if (!op.is_matching) {
                    row.getCell('is_matching').font = { color: { argb: 'FFDC2626' }, bold: true };
                } else {
                    row.getCell('is_matching').font = { color: { argb: 'FF16A34A' }, bold: true };
                }

                row.alignment = { horizontal: 'right' };
            });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=operations_report.xlsx');

            await workbook.xlsx.write(res);
            res.end();
        }

    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Failed to export report' });
    }
}

function generateCSV(data) {
    const headers = [
        'معرف العملية', 'التاريخ', 'الفرع', 'السيارة', 'الموديل', 'سنة الصنع',
        'نوع الزيت', 'اللزوجة', 'الكمية', 'الحالة', 'السبب'
    ];

    const rows = data.map(op => [
        op.id,
        new Date(op.created_at).toLocaleDateString('ar-EG'),
        op.branch_name || '-',
        op.car_brand,
        op.car_model,
        op.car_year,
        op.oil_used,
        op.oil_viscosity,
        op.oil_quantity,
        op.is_matching ? 'مطابق' : 'غير مطابق',
        op.mismatch_reason || '-'
    ]);

    // Add BOM for Excel to recognize UTF-8
    return '\uFEFF' + [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');
}
