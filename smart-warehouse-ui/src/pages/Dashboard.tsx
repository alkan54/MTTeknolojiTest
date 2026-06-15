import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Card, CardContent, Grid, Paper } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import api from '../services/api';

interface RecentProduct {
  id: number;
  name: string;
  sku: string;
  stockQuantity: number;
}

export default function Dashboard() {
  const [products, setProducts] = useState<RecentProduct[]>([]);
  const [stats, setStats] = useState({ totalProducts: 0, totalStock: 0, lowStock: 0 });

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/products', { params: { page: 1, pageSize: 10 } });
      const items = res.data.data || [];
      setProducts(items);
      const totalProducts = res.data.totalCount || items.length;
      const totalStock = items.reduce((sum: number, p: RecentProduct) => sum + (p.stockQuantity || 0), 0);
      const lowStock = items.filter((p: RecentProduct) => (p.stockQuantity || 0) < 10).length;
      setStats({ totalProducts, totalStock, lowStock });
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const cards = [
    { label: 'Toplam Ürün', value: stats.totalProducts, icon: <InventoryIcon />, color: '#1976d2' },
    { label: 'Toplam Stok', value: stats.totalStock, icon: <CategoryIcon />, color: '#2e7d32' },
    { label: 'Düşük Stoklu', value: stats.lowStock, icon: <TrendingDownIcon />, color: '#ed6c02' },
    { label: 'Depo Bölgesi', value: 1, icon: <LocalShippingIcon />, color: '#9c27b0' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2.5 }}>Gösterge Paneli</Typography>

      {/* Özet Kartları */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {cards.map((c) => (
          <Grid key={c.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {c.label}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
                      {typeof c.value === 'number' ? c.value.toLocaleString('tr-TR') : c.value}
                    </Typography>
                  </Box>
                  <Box sx={{
                    width: 42, height: 42, borderRadius: 1, bgcolor: c.color + '14',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: c.color,
                  }}>
                    {c.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Son Ürünler Tablosu */}
      <Paper>
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #dcdcde' }}>
          <Typography variant="h6">Son Eklenen Ürünler</Typography>
        </Box>
        <Box component="table" sx={{
          width: '100%', borderCollapse: 'collapse',
          '& th': { textAlign: 'left', px: 2, py: 1.2, fontSize: '0.75rem', fontWeight: 600, color: '#646970', textTransform: 'uppercase', borderBottom: '1px solid #dcdcde', bgcolor: '#f6f7f7' },
          '& td': { px: 2, py: 1.2, fontSize: '0.8125rem', borderBottom: '1px solid #f0f0f1' },
          '& tbody tr:hover': { bgcolor: '#f6f7f7' },
        }}>
          <thead>
            <tr><th>Ürün Adı</th><th>SKU</th><th>Stok</th><th>Durum</th></tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#646970', padding: '24px' }}>Henüz ürün eklenmemiş.</td></tr>
            ) : products.map((p) => (
              <tr key={p.id}>
                <td><Typography variant="body2" sx={{ fontWeight: 500, color: '#1976d2' }}>{p.name}</Typography></td>
                <td><Typography variant="body2" sx={{ color: '#646970' }}>{p.sku}</Typography></td>
                <td><Typography variant="body2" sx={{ fontWeight: 600 }}>{(p.stockQuantity || 0).toLocaleString('tr-TR')}</Typography></td>
                <td>
                  <Box component="span" sx={{
                    display: 'inline-block', px: 1, py: 0.3, borderRadius: 0.5, fontSize: '0.6875rem', fontWeight: 600,
                    bgcolor: (p.stockQuantity || 0) > 10 ? '#d1e7dd' : (p.stockQuantity || 0) > 0 ? '#fff3cd' : '#f8d7da',
                    color: (p.stockQuantity || 0) > 10 ? '#0f5132' : (p.stockQuantity || 0) > 0 ? '#664d03' : '#842029',
                  }}>
                    {(p.stockQuantity || 0) > 10 ? 'Yeterli' : (p.stockQuantity || 0) > 0 ? 'Düşük' : 'Tükenmiş'}
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Box>
      </Paper>
    </Box>
  );
}
