import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Modal } from 'react-bootstrap'
function Table() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [keyword, setKeyWord] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [inputQty, setInputQty] = useState(1);
  const [inputProduct, setInputProduct] = useState(0);
  const [product, setProduct] = useState([]);
  const [msg, setMsg] = useState('');
  const [msgStat, setMsgStat] = useState(true);
  const [showMsg, setShowMsg] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [updateId, setUpdateId] = useState('');
  const [order, setOrder] = useState('qty');
  const [orderDir, setOrderDir] = useState('ASC');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const handleClose = () => {
    setModal(false);
  }
  const handleCloseUpdateModal = () => {
    setInputDate('');
    setInputQty(1);
    setInputProduct(0);
    setUpdateId('');
    setUpdateModal(false)
  }
  const getData = async () => {
    try {
      await axios.get(`http://localhost:8080/api/transaction?search=${keyword}&orderBy=${order}&orderDirection=${orderDir}&startDate=${startDate}&endDate=${endDate}`).then(response => {
        setData(response.data.results.data);
      })

    } catch (error) {
      console.log(error)
    }
  }
  const getProduct = async () => {
    try {
      await axios.get(`http://localhost:8080/api/products`).then(response => {
        setProduct(response.data.results.data);
      })

    } catch (error) {
      console.log(error)
    }
  }
  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      const data = {
        transaction_date: inputDate,
        qty: inputQty,
        product_id: inputProduct
      }
      await axios.post('http://localhost:8080/api/transaction', data).then(response => {
        setInputDate('');
        setInputQty(1);
        setInputProduct(0);
        setMsg('Data berhasil ditambahkan')
        setShowMsg(true);
        setMsgStat(true)
        setModal(false);
        getData();
      })
    } catch (error) {
      setModal(false);
      setMsg('Gagal menambahkan data, isi semua field')
      setShowMsg(true);
      setMsgStat(false)
    }
  }
  const handleDeleteTransaction = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/transaction/${id}`).then(response => {
        setMsg('Data berhasil dihapus')
        setShowMsg(true);
        setMsgStat(true)
        setModal(false);
        getData()
      })
    } catch (error) {

    }
  }
  const openModalUpdate = async (data) => {
    setUpdateModal(true)
    setInputDate(data.transaction_date.split('T')[0])
    setInputProduct(data.product_id)
    setInputQty(data.qty)
    setUpdateId(data.id)
  }
  const handleUpdateTransaction = async (e) => {
    e.preventDefault();
    try {
      const data = {
        qty: inputQty,
        product_id: inputProduct
      }
      await axios.put(`http://localhost:8080/api/transaction/${updateId}`, data).then(response => {
        setInputDate('');
        setInputQty(1);
        setInputProduct(0);
        setUpdateId('');
        setMsg('Data berhasil dubah!!!')
        setShowMsg(true);
        setMsgStat(true)
        setUpdateModal(false);
        getData();
      })
    } catch (error) {
      setUpdateModal(false);
      setMsg('Gagal mengubah data!!')
      setShowMsg(true);
      setMsgStat(false)
    }
  }

  // const [modalProduct, setModalProduct] = useState(false);
  const [tambahProductModal, setTambahProductModal] = useState(false);
  const handleCloseTambahProductModal = () => {
    setTambahProductModal(false)
  }
  const tambahProduct = async (e) => {
    e.preventDefault()
    try {
      const data = {
        name: inputDataProduct,
        stock: inputDataStock,
        category: inputDataKategori
      }
      await axios.post('http://localhost:8080/api/products', data).then(response => {
        setInputDataProduct('');
        setInputDataStock(1);
        setInputDataKategori('');
        setMsg('Data berhasil ditambahkan')
        setShowMsg(true);
        setMsgStat(true)
        setTambahProductModal(false);
        getProduct()
      })
    } catch (error) {
      setModal(false);
      setMsg('Gagal menambahkan data, isi semua field')
      setShowMsg(true);
      setMsgStat(false)
    }
  }
  const [inputDataProduct, setInputDataProduct] = useState('');
  const [inputDataKategori, setInputDataKategori] = useState('');
  const [inputDataStock, setInputDataStock] = useState('');


  const filterTanggal = () => {
    if (startDate == null || startDate == '') {
      setMsg('Isi tanggal awal')
      setShowMsg(true);
      setMsgStat(false)
    }
    if (endDate == null || endDate == '') {
      setMsg('Isi tanggal akhir')
      setShowMsg(true);
      setMsgStat(false)
    }
    getData()
  }
  useEffect(() => {
    getData();
  }, [keyword, order, orderDir])
  useEffect(() => {
    getData();
    getProduct();
  }, [])
  return (
    <div className='mt-3'>
      <h5>Tabel Transaksi</h5>
      <div className="filter d-flex gap-2">
        <div className="d-flex gap-2">
          <div className="form-group">
            <small className='text-dark'>Tanggal mulai</small>
            <input type="date" className='form-control form-control-sm' value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="form-group">
            <small>Tanggal Akhir</small>
            <input type="date" className='form-control form-control-sm' value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <small>Kolom</small>
          <select className='form-select' value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="qty">Jumlah Terjual</option>
          </select>
        </div>
        <div className="form-group">
          <small>Jenis</small>
          <select className='form-select' value={orderDir} onChange={(e) => setOrderDir(e.target.value)}>
            <option value="ASC">ASC</option>
            <option value="DESC">DESC</option>
          </select>
        </div>
      </div>
      <div className="button-group mb-3">
        <button className='btn btn-primary btn-sm' type='button' onClick={filterTanggal}>Filter</button>
      </div>
      <div className="d-flex justify-content-between">
        <div className="form-group">
          <small>Pencarian</small>
          <input type="text" className='form-control form-control-sm' placeholder='Pencarian' value={keyword} onChange={(e) => setKeyWord(e.target.value)} />
        </div>
        <div className="button-group d-flex gap-2 justify-content-end my-4">
          <button className='btn btn-success btn-sm' type='button' onClick={() => setTambahProductModal(true)}> Tambah Produk</button>
          <button className='btn btn-primary btn-sm' type='button' onClick={() => setModal(true)}> Tambah Transaksi</button>
        </div>
      </div>

      <div className="table-responsive">
        {/* <div className="d-flex justify-content-center">
          //   <small className='text-muted'>Tidak ada data</small>
        </div> */}
        <small className={`${showMsg ? '' : 'd-none'} ${msgStat ? 'text-success' : 'text-danger'}`}>{msg}</small>
        <table className="table table-bordered table-sm">
          <tr>
            <th>Produk</th>
            <th>Stok</th>
            <th>Jumlah Terjual</th>
            <th>Tanggal Transaksi</th>
            <th>Kategori</th>
            <th>Perintah</th>
          </tr>
          <tbody>
            {data && data.map((obj, i) => {
              return <tr key={i}>
                <td>{obj.product.name}</td>
                <td>{obj.product.stock}</td>
                <td>{obj.qty}</td>
                <td>{
                  new Date(obj.transaction_date).toLocaleDateString()
                }</td>
                <td> <div className="badge text-bg-success">{obj.product.category}</div></td>
                <td>
                  <div className="button-group d-flex gap-2">
                    <button className='btn btn-danger btn-sm' type='button' onClick={() => handleDeleteTransaction(obj.id)}> Hapus</button>
                    <button className='btn btn-success btn-sm' type='button' onClick={() => openModalUpdate(obj)}> Update</button>
                  </div>
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
      <Modal show={modal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Transaksi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <form action="" onSubmit={handleAddProduct}>
              <div className="form-group">
                <label htmlFor="">Tanggal transaksi</label>
                <input type="date" className='form-control form-control-sm' onChange={(e) => setInputDate(e.target.value)} placeholder='Tanggal' value={inputDate} required />
              </div>
              <div className="form-group">
                <label htmlFor="">Jumlah terjual</label>
                <input type="number" className='form-control form-control-sm' onChange={(e) => setInputQty(e.target.value)} placeholder='Jumlag terjual' value={inputQty} required />
              </div>
              <div className="form-group">
                <label htmlFor="">Pilih product</label>
                <select className='form-select' value={inputProduct} onChange={(e) => setInputProduct(e.target.value)} required>
                  <option selected value={0}>Pilih produk</option>
                  {product && product.map((obj, i) => {
                    return <option value={obj.id} key={i}>{obj.name}</option>
                  })}
                </select>
              </div>
              <div className="button-group d-flex justify-content-end my-3">
                <button className='btn btn-primary' type='submit'>Tambah</button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={updateModal} onHide={handleCloseUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Transaksi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <form action="" onSubmit={handleUpdateTransaction}>
              <div className="form-group">
                <label htmlFor="">Tanggal transaksi</label>
                <input type="date" className='form-control form-control-sm' value={inputDate} readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="">Jumlah terjual</label>
                <input type="number" className='form-control form-control-sm' onChange={(e) => setInputQty(e.target.value)} value={inputQty} required />
              </div>
              <div className="form-group">
                <label htmlFor="">Pilih product</label>
                <select className='form-select' value={inputProduct} onChange={(e) => setInputProduct(e.target.value)} required>
                  <option selected value={0}>Pilih produk</option>
                  {product && product.map((obj, i) => {
                    return <option value={obj.id} key={i}>{obj.name}</option>
                  })}
                </select>
              </div>
              <div className="button-group d-flex justify-content-end my-3">
                <button className='btn btn-primary' type='submit'>Update</button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={tambahProductModal} onHide={handleCloseTambahProductModal}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Produk</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <form action="" onSubmit={tambahProduct}>
              <div className="form-group">
                <label htmlFor="">Nama produk</label>
                <input type="text" className='form-control form-control-sm' onChange={(e) => setInputDataProduct(e.target.value)} value={inputDataProduct} required />
              </div>
              <div className="form-group">
                <label htmlFor="">Kategori</label>
                <input type="text" className='form-control form-control-sm' onChange={(e) => setInputDataKategori(e.target.value)} value={inputDataKategori} required />
              </div>
              <div className="form-group">
                <label htmlFor="">Jumlah Stok</label>
                <input type="number" className='form-control form-control-sm' onChange={(e) => setInputDataStock(e.target.value)} value={inputDataStock} required />
              </div>
              <div className="button-group d-flex justify-content-end my-3">
                <button className='btn btn-primary' type='submit'>Tambah</button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Table