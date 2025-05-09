import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Booklist() {
    const [books, setBooks] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedBook, setEditedBook] = useState({ title: "", author: "" });
    const router = useRouter();

    useEffect(() => {
        fetch('/api/books')
            .then(res => res.json())
            .then(data => setBooks(data));
    }, []);

    const deleteBook = async (id) => {
        const confirmed = confirm('Yakin ingin menghapus buku ini?');
        if (!confirmed) return;

        const res = await fetch(`/api/books/${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            setBooks(books.filter(book => book.id !== id));
        }
    };

    const startEdit = (book) => {
        setEditingId(book.id);
        setEditedBook({ title: book.title, author: book.author });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditedBook({ title: "", author: "" });
    };

    const saveEdit = async (id) => {
        const res = await fetch(`/api/books/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editedBook),
        });

        if (res.ok) {
            const updated = await res.json();
            setBooks(books.map(book => book.id === id ? updated : book));
            cancelEdit();
        }
    };

    return (
        <div style={{
            padding: '2rem',
            fontFamily: "'Georgia', serif",
            backgroundColor: '#f8f4ee', 
            minHeight: '100vh'
        }}>
            <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
}}>
    <h1 style={{
        fontSize: '2.2rem',
        color: '#5d4037',
        margin: 0,
        fontWeight: 600
    }}>📚 Daftar Buku</h1>
    
    <div style={{ display: 'flex', gap: '1rem' }}>
        <a href="/books/categories" style={{
            background: 'linear-gradient(to right, #7986cb, #5c6bc0)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(139, 87, 42, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        }}>
            📂 Kategori
        </a>
        <a href="/books/add" style={{
            background: 'linear-gradient(to right, #a1887f, #8d6e63)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(139, 87, 42, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        }}>
            ➕ Tambah Buku
        </a>
    </div>
</div>

            {books.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    color: '#8d6e63',
                    padding: '3rem',
                    backgroundColor: '#f5efea',
                    borderRadius: '12px',
                    border: '1px dashed #d7ccc8'
                }}>
                    <p>Belum ada buku yang tersedia</p>
                </div>
            ) : (
                <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    display: 'grid',
                    gap: '1.25rem'
                }}>
                    {books.map(b => (
                        <li key={b.id} style={{
                            background: '#fff9f5', 
                            border: '1px solid #e0d5cd', 
                            borderRadius: '12px',
                            padding: '1.5rem',
                            boxShadow: '0 2px 8px rgba(139, 87, 42, 0.05)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}>
                            {editingId === b.id ? (
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <input
                                        type="text"
                                        value={editedBook.title}
                                        onChange={e => setEditedBook({ ...editedBook, title: e.target.value })}
                                        placeholder="Judul"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            marginBottom: '0.75rem',
                                            border: '1px solid #d7ccc8',
                                            borderRadius: '6px',
                                            backgroundColor: '#fffcf9',
                                            color: '#5d4037',
                                            fontFamily: "'Georgia', serif"
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={editedBook.author}
                                        onChange={e => setEditedBook({ ...editedBook, author: e.target.value })}
                                        placeholder="Penulis"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #d7ccc8',
                                            borderRadius: '6px',
                                            backgroundColor: '#fffcf9',
                                            color: '#5d4037',
                                            fontFamily: "'Georgia', serif"
                                        }}
                                    />
                                </div>
                            ) : (
                                <>
                                    <h3 style={{
                                        fontSize: '1.3rem',
                                        color: '#4e342e', 
                                        margin: '0 0 0.5rem 0',
                                        fontWeight: 600
                                    }}>{b.title}</h3>
                                    <p style={{
                                        color: '#8d6e63',
                                        fontStyle: 'italic',
                                        marginBottom: '1.25rem'
                                    }}>oleh {b.author}</p>
                                </>
                            )}
                            <div style={{
                                display: 'flex',
                                gap: '0.75rem',
                                flexWrap: 'wrap'
                            }}>
                                {editingId === b.id ? (
                                    <>
                                        <button 
                                            onClick={() => saveEdit(b.id)} 
                                            style={{
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '0.6rem 1.2rem',
                                                cursor: 'pointer',
                                                fontWeight: 500,
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                backgroundColor: '#a5d6a7', 
                                                color: '#2e7d32'
                                            }}
                                        >
                                            💾 Simpan
                                        </button>
                                        <button 
                                            onClick={cancelEdit} 
                                            style={{
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '0.6rem 1.2rem',
                                                cursor: 'pointer',
                                                fontWeight: 500,
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                backgroundColor: '#ffab91', 
                                                color: '#d84315'
                                            }}
                                        >
                                            ❌ Batal
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button 
                                            onClick={() => startEdit(b)} 
                                            style={{
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '0.6rem 1.2rem',
                                                cursor: 'pointer',
                                                fontWeight: 500,
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                backgroundColor: '#ffe082',
                                                color: '#ff8f00'
                                            }}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button 
                                            onClick={() => deleteBook(b.id)} 
                                            style={{
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '0.6rem 1.2rem',
                                                cursor: 'pointer',
                                                fontWeight: 500,
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                backgroundColor: '#ef9a9a', 
                                                color: '#c62828'
                                            }}
                                        >
                                            🗑️ Hapus
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
