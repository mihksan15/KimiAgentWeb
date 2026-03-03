import type { Product, Order, Expense } from '@/types';

// Export products to CSV format (can be opened in Excel)
export function exportProductsToCSV(products: Product[]): string {
  const headers = [
    'ID',
    'Nama Produk',
    'Deskripsi',
    'Harga Jual',
    'Harga Modal',
    'Kategori',
    'Stok',
    'Satuan',
    'Tersedia',
    'Bestseller',
    'Rating',
    'Reviews',
    'Gambar'
  ];

  const rows = products.map(product => [
    product.id,
    product.name,
    product.description,
    product.price,
    product.costPrice || 0,
    product.category,
    product.stock,
    product.unit,
    product.isAvailable ? 'Ya' : 'Tidak',
    product.isBestseller ? 'Ya' : 'Tidak',
    product.rating || 0,
    product.reviews || 0,
    product.image
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => {
        // Escape cells that contain commas or quotes
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')
    )
  ].join('\n');

  return csvContent;
}

// Export orders to CSV format
export function exportOrdersToCSV(orders: Order[]): string {
  const headers = [
    'Order ID',
    'Tanggal',
    'Nama Pelanggan',
    'Telepon',
    'Alamat',
    'Item',
    'Total',
    'Ongkir',
    'Final Total',
    'Metode Pembayaran',
    'Metode Pengiriman',
    'Status',
    'Catatan'
  ];

  const rows = orders.map(order => [
    order.id,
    order.createdAt,
    order.customerName,
    order.customerPhone,
    order.customerAddress,
    order.items.map(item => `${item.name}(${item.quantity})`).join('; '),
    order.totalAmount,
    order.shippingCost,
    order.finalAmount,
    order.paymentMethod,
    order.shippingMethod,
    order.status,
    order.notes || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => {
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')
    )
  ].join('\n');

  return csvContent;
}

// Export expenses to CSV format
export function exportExpensesToCSV(expenses: Expense[]): string {
  const headers = [
    'ID',
    'Tanggal',
    'Kategori',
    'Deskripsi',
    'Jumlah',
    'Catatan'
  ];

  const rows = expenses.map(expense => [
    expense.id,
    expense.date,
    expense.category,
    expense.description,
    expense.amount,
    expense.notes || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => {
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')
    )
  ].join('\n');

  return csvContent;
}

// Export financial report to CSV
export function exportFinancialReportToCSV(
  orders: Order[],
  expenses: Expense[],
  startDate: string,
  endDate: string
): string {
  // Filter orders and expenses by date range
  const filteredOrders = orders.filter(order =>
    order.createdAt >= startDate && order.createdAt <= endDate
  );
  const filteredExpenses = expenses.filter(expense =>
    expense.date >= startDate && expense.date <= endDate
  );

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.finalAmount, 0);
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  // Summary section
  const summaryHeaders = ['Laporan Keuangan', `Periode: ${startDate} - ${endDate}`];
  const summaryRows = [
    ['Total Pendapatan', totalRevenue],
    ['Total Pengeluaran', totalExpenses],
    ['Laba Bersih', netProfit],
    ['', ''],
    ['Detail Pendapatan', ''],
    ['Order ID', 'Tanggal', 'Pelanggan', 'Total', 'Status']
  ];

  const orderRows = filteredOrders.map(order => [
    order.id,
    order.createdAt,
    order.customerName,
    order.finalAmount,
    order.status
  ]);

  const expenseSection = [
    ['', ''],
    ['Detail Pengeluaran', ''],
    ['ID', 'Tanggal', 'Kategori', 'Deskripsi', 'Jumlah']
  ];

  const expenseRows = filteredExpenses.map(expense => [
    expense.id,
    expense.date,
    expense.category,
    expense.description,
    expense.amount
  ]);

  const allRows = [
    summaryHeaders,
    ...summaryRows,
    ...orderRows,
    ...expenseSection,
    ...expenseRows
  ];

  return allRows.map(row => 
    row.map(cell => {
      const cellStr = String(cell);
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    }).join(',')
  ).join('\n');
}

// Download CSV file (Excel compatible)
export function downloadCSV(csvContent: string, filename: string) {
  // Add BOM for Excel UTF-8 compatibility
  const BOM = '\uFEFF';
  const contentWithBOM = BOM + csvContent;
  
  const blob = new Blob([contentWithBOM], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

// Parse CSV to array of objects
export function parseCSV(csvContent: string): Record<string, string>[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    return obj;
  });
}

// Parse a single CSV line handling quotes
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

// Convert parsed CSV to Product format
export function csvToProducts(data: Record<string, string>[]): Partial<Product>[] {
  return data.map(row => ({
    id: row['ID'] || row['id'],
    name: row['Nama Produk'] || row['name'] || row['Nama'],
    description: row['Deskripsi'] || row['description'] || row['Deskripsi Produk'],
    price: parseFloat(row['Harga Jual'] || row['price'] || row['Harga'] || '0'),
    costPrice: parseFloat(row['Harga Modal'] || row['costPrice'] || row['Harga Modal'] || '0'),
    category: row['Kategori'] || row['category'] || row['Kategori Produk'],
    stock: parseInt(row['Stok'] || row['stock'] || row['Jumlah Stok'] || '0'),
    unit: row['Satuan'] || row['unit'] || 'pcs',
    isAvailable: (row['Tersedia'] || row['isAvailable'] || row['Tersedia'] || '').toLowerCase() === 'ya',
    isBestseller: (row['Bestseller'] || row['isBestseller'] || '').toLowerCase() === 'ya',
    image: row['Gambar'] || row['image'] || row['URL Gambar'] || '/images/products/default.jpg'
  }));
}

// Convert parsed CSV to Expense format
export function csvToExpenses(data: Record<string, string>[]): Partial<Expense>[] {
  return data.map(row => ({
    id: row['ID'] || row['id'],
    date: row['Tanggal'] || row['date'] || new Date().toISOString().slice(0, 10),
    category: (row['Kategori'] || row['category'] || row['Kategori Pengeluaran'] || 'other') as 'inventory' | 'operational' | 'marketing' | 'other',
    description: row['Deskripsi'] || row['description'] || row['Keterangan'],
    amount: parseFloat(row['Jumlah'] || row['amount'] || row['Nominal'] || '0'),
    notes: row['Catatan'] || row['notes'] || row['Keterangan Tambahan'] || ''
  }));
}
