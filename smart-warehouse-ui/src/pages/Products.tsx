import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Paper, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, Snackbar, Alert, InputAdornment
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import api from '../services/api';

interface Product {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  stockQuantity: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' as 'success' | 'error' });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/products', {
        params: { page: paginationModel.page + 1, pageSize: paginationModel.pageSize, search }
      });
      setProducts(res.data.data);
      setTotalRowCount(res.data.totalCount);
    } catch {
      setToast({ open: true, message: 'Ürünler yüklenemedi', type: 'error' });
    }
    setLoading(false);
  }, [paginationModel, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSave = async () => {
    try {
      const companyId = localStorage.getItem('companyId');
      if (currentProduct.id) {
        await api.post('/products/update', { ...currentProduct, companyId });
        setToast({ open: true, message: 'Ürün güncellendi.', type: 'success' });
      } else {
        await api.post('/products/create', { ...currentProduct, companyId });
        setToast({ open: true, message: 'Ürün eklendi.', type: 'success' });
      }
      setOpenModal(false);
      fetchProducts();
    } catch {
      setToast({ open: true, message: 'İşlem başarısız oldu.', type: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      const companyId = localStorage.getItem('companyId');
      await api.post('/products/delete', { id: currentProduct.id, companyId });
      setToast({ open: true, message: 'Ürün silindi.', type: 'success' });
      setOpenDeleteModal(false);
      fetchProducts();
    } catch {
      setToast({ open: true, message: 'Silme başarısız.', type: 'error' });
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 60 },
    {
      field: 'name', headerName: 'Ürün Adı', flex: 1, minWidth: 180,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1976d2' }}>{params.value}</Typography>
      ),
    },
    { field: 'sku', headerName: 'SKU', flex: 0.7, minWidth: 120 },
    { field: 'barcode', headerName: 'Barkod', flex: 0.7, minWidth: 120 },
    {
      field: 'stockQuantity', headerName: 'Stok', width: 120,
      renderCell: (params) => {
        const qty = params.value || 0;
        const bg = qty > 10 ? '#d1e7dd' : qty > 0 ? '#fff3cd' : '#f8d7da';
        const color = qty > 10 ? '#0f5132' : qty > 0 ? '#664d03' : '#842029';
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{qty.toLocaleString('tr-TR')}</Typography>
            <Box component="span" sx={{ px: 0.8, py: 0.2, borderRadius: 0.5, fontSize: '0.65rem', fontWeight: 600, bgcolor: bg, color }}>
              {qty > 10 ? 'Yeterli' : qty > 0 ? 'Düşük' : 'Yok'}
            </Box>
          </Box>
        );
      },
    },
    {
      field: 'actions', headerName: 'İşlemler', width: 100, sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" onClick={() => { setCurrentProduct(params.row); setOpenModal(true); }} title="Düzenle">
            <EditIcon fontSize="small" sx={{ color: '#1976d2' }} />
          </IconButton>
          <IconButton size="small" onClick={() => { setCurrentProduct(params.row); setOpenDeleteModal(true); }} title="Sil">
            <DeleteIcon fontSize="small" sx={{ color: '#d32f2f' }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Ürünler</Typography>
        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => { setCurrentProduct({}); setOpenModal(true); }}>
          Yeni Ürün Ekle
        </Button>
      </Box>

      {/* Arama */}
      <Paper sx={{ p: 1.5, mb: 2 }}>
        <TextField
          placeholder="Ürün adı, SKU veya barkod ile ara..."
          variant="outlined"
          fullWidth
          size="small"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPaginationModel({ ...paginationModel, page: 0 }); }}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#646970' }} /></InputAdornment>,
            },
          }}
        />
      </Paper>

      {/* Tablo */}
      <Paper>
        <DataGrid
          rows={products}
          columns={columns}
          paginationMode="server"
          rowCount={totalRowCount}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          disableRowSelectionOnClick
          rowHeight={48}
          sx={{ minHeight: 450, border: 'none' }}
        />
      </Paper>

      {/* Ekle/Düzenle Modalı */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ borderBottom: '1px solid #dcdcde', py: 1.5 }}>
          {currentProduct.id ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
        </DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <TextField autoFocus margin="dense" label="Ürün Adı" fullWidth size="small"
            value={currentProduct.name || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })} />
          <TextField margin="dense" label="SKU" fullWidth size="small"
            value={currentProduct.sku || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, sku: e.target.value })} />
          <TextField margin="dense" label="Barkod" fullWidth size="small"
            value={currentProduct.barcode || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, barcode: e.target.value })} />
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #dcdcde', px: 2, py: 1.5 }}>
          <Button onClick={() => setOpenModal(false)} size="small">İptal</Button>
          <Button onClick={handleSave} variant="contained" size="small">
            {currentProduct.id ? 'Güncelle' : 'Kaydet'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Silme Onayı */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #dcdcde', py: 1.5 }}>Silme Onayı</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <Typography variant="body2">
            <strong>{currentProduct.name}</strong> adlı ürünü silmek istediğinize emin misiniz?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #dcdcde', px: 2, py: 1.5 }}>
          <Button onClick={() => setOpenDeleteModal(false)} size="small">Vazgeç</Button>
          <Button onClick={handleDelete} variant="contained" color="error" size="small">Sil</Button>
        </DialogActions>
      </Dialog>

      {/* Bildirim */}
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.type} variant="filled" sx={{ fontSize: '0.8125rem' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
