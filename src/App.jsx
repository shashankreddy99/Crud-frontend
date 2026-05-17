import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002'

function App() {
  const [items, setItems] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentItem, setCurrentItem] = useState({ name: '', description: '' })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/items`)
      setItems(response.data)
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/items/${currentItem.id}`, currentItem)
      } else {
        await axios.post(`${API_URL}/items`, currentItem)
      }
      fetchItems()
      closeModal()
    } catch (error) {
      console.error('Error saving item:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${API_URL}/items/${id}`)
        fetchItems()
      } catch (error) {
        console.error('Error deleting item:', error)
      }
    }
  }

  const openModal = (item = { name: '', description: '' }) => {
    setCurrentItem(item)
    setIsEditing(!!item.id)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentItem({ name: '', description: '' })
    setIsEditing(false)
  }

  return (
    <div className="container">
      <header className="header">
        <div className="title-group">
          <h1>Inventory Hub</h1>
          <p>Seamlessly manage your items with precision.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={20} />
          Create Item
        </button>
      </header>

      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <div className="item-grid">
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className="glass item-card animate-in" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3>{item.name}</h3>
              <p>{item.description || 'No description provided.'}</p>
              <div className="card-actions">
                <button 
                  className="btn btn-ghost" 
                  onClick={() => openModal(item)}
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  className="btn btn-ghost" 
                  style={{ color: 'var(--error)' }}
                  onClick={() => handleDelete(item.id)}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && !loading && (
            <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
              No items found. Start by creating one!
            </p>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="glass modal-content animate-in">
            <button className="btn btn-ghost" style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.5rem' }} onClick={closeModal}>
              <X size={20} />
            </button>
            <h2 style={{ marginBottom: '2rem' }}>{isEditing ? 'Edit Item' : 'Create New Item'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Item Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required
                  value={currentItem.name}
                  onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
                  placeholder="e.g. Quantum Processor"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  className="form-input" 
                  rows="4"
                  value={currentItem.description}
                  onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
                  placeholder="Describe the item's purpose or specifications..."
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  <Check size={20} />
                  {isEditing ? 'Update Item' : 'Create Item'}
                </button>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
