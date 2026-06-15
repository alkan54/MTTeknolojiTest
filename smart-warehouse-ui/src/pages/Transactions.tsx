import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Paper, TextField, Snackbar, Alert, Grid,
  MenuItem, Select, InputLabel, FormControl, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import api from '../services/api';

export default function Transactions() {
  const [products, setProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    productId: '',
    locationId: 1,
    quantity: '',
    transactionType: '1',
    notes: ''
  });
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' as 'success' | 'error' });
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.get('/products', { params: { pageSize: 100 } });
      setProducts(res.data.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const companyId = localStorage.getItem('companyId');
      await api.post('/transactions/create', {
        ...formData,
        transactionType: Number(formData.transactionType),
        quantity: Number(formData.quantity),
        companyId
      });
      const msg = formData.transactionType === '1' ? 'Stok girişi başarıyla tamamlandı.' : 'Stok çıkışı başarıyla tamamlandı.';
      setToast({ open: true, message: msg, type: 'success' });
      setFormData({ ...formData, quantity: '', notes: '', productId: '' });
      fetchProducts();
    } catch {
      setToast({ open: true, message: 'İşlem başarısız oldu.', type: 'error' });
    }
    setSubmitting(false);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2.5 }}>Stok Hareketleri</Typography>

      <Paper sx={{ maxWidth: 560 }}>
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #dcdcde', bgcolor: '#f6f7f7' }}>
          <Typography variant="h6">Yeni Stok Hareketi</Typography>
        </Box>
        <Box sx={{ p: 2.5 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>
              {/* İşlem Türü */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>İşlem Türü</Typography>
                <RadioGroup
                  row
                  value={formData.transactionType}
                  onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
                >
                  <FormControlLabel value="1" control={<Radio size="small" />} label={<Typography variant="body2">Stok Girişi</Typography>} />
                  <FormControlLabel value="2" control={<Radio size="small" color="error" />} label={<Typography variant="body2">Stok Çıkışı</Typography>} />
                </RadioGroup>
              </Grid>

              {/* Ürün */}
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Ürün</InputLabel>
                  <Select
                    value={formData.productId}
                    label="Ürün"
                    onChange={(e) => setFormData({ ...formData, productId: String(e.target.value) })}
                    required
                  >
                    {products.map(p => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name} — <span style={{ color: '#646970' }}>{p.sku}</span>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Miktar */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Miktar"
                  type="number"
                  fullWidth
                  size="small"
                  required
                  slotProps={{ htmlInput: { min: 1 } }}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </Grid>

              {/* Not */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Not (opsiyonel)"
                  fullWidth
                  size="small"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>

              {/* Gönder */}
              <Grid size={{ xs: 12 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting || !formData.productId || !formData.quantity}
                  color={formData.transactionType === '1' ? 'primary' : 'error'}
                  sx={{ mr: 1 }}
                >
                  {submitting ? 'İşleniyor...' : formData.transactionType === '1' ? 'Stok Girişi Yap' : 'Stok Çıkışı Yap'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setFormData({ productId: '', locationId: 1, quantity: '', transactionType: '1', notes: '' })}
                >
                  Temizle
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.type} variant="filled" sx={{ fontSize: '0.8125rem' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
