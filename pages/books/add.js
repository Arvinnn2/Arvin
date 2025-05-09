import { useRouter } from "next/router";
import BookForm from "../../component/BookForm";
import styles from "../../component/BookForm.module.css";

export default function AddBook() {
    const router = useRouter();
    const addBook = async (book) => {
        try {
            const response = await fetch("/api/books", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(book)
            });
            
            if (!response.ok) throw new Error('Failed to add book');
            
            router.push("/books");
        } catch (error) {
            console.error("Error adding book:", error);
        }
    };
    
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Add New Book</h1>
            <BookForm onSubmit={addBook} />
        </div>
    );
}
