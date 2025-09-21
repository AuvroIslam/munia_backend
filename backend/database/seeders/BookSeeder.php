<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing books first
        Book::truncate();

        $books = [
            [
                'title' => 'A Brief History of Time',
                'author' => 'Stephen Hawking',
                'description' => 'Explores fundamental questions about the universe 
                such as Big bang, black holes and the natures itself',
                'genre' => 'Science',
                'price' => 0.00,
                'is_free' => true,
                'rating' => 4.8,
                'cover_image' => 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1348314953i/818560.jpg',
                'pdf_file_path' => 'pdfs/a-brief-history-of-time.pdf',
                'featured' => true,
                'editors_pick' => true,
                'publication_date' => '1988-01-01'
            ],
            [
                'title' => 'The Feynman Lectures on Physics',
                'author' => 'Richard P. Feynman',
                'description' => 'One of the most famous physics books ever written. It provides a deep and 
                insightful overview of physics by the legendary Nobel Laureate',
                'genre' => 'Science',
                'price' => 0.00,
                'is_free' => true,
                'rating' => 4.9,
                'cover_image' => 'https://m.media-amazon.com/images/I/71yIHocz9yL._UF1000,1000_QL80_.jpg',
                'pdf_file_path' => 'pdfs/feynman-lectures-on-physics.pdf',
                'featured' => true,
                'editors_pick' => false,
                'publication_date' => '1964-01-01'
            ],
            [
                'title' => 'The Art of War',
                'author' => 'Sun Tzu',
                'description' => 'The Art of War is an ancient Chinese military treatise by 
                Sun Tzu from the 5th century BC, 
                offering 13 chapters of strategic wisdom on warfare, 
                tactics, leadership, and adaptability.',
                'genre' => 'Writing',
                'price' => 0.00,
                'is_free' => true,
                'rating' => 5.0,
                'cover_image' => 'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781626860605/the-art-of-war-9781626860605_hr.jpg',
                'pdf_file_path' => 'pdfs/The_Art_Of_War.pdf',
                'featured' => true,
                'editors_pick' => false,
                'publication_date' => '1910-01-01'
            ],
            [
                'title' => 'The Psychology of Money',
                'author' => 'Morgan Housel',
                'description' => 'Explores how personal behavior and psychology are just as important as 
                financial technical knowledge when it comes to building wealth',
                'genre' => 'Business',
                'price' => 0.00,
                'is_free' => true,
                'rating' => 4.7,
                'cover_image' => 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1581527774i/41881472.jpg',
                'pdf_file_path' => 'pdfs/The-Psychology-of-Money.pdf',
                'featured' => false,
                'editors_pick' => true,
                'publication_date' => '2018-01-01'
            ],
            [
                'title' => 'Hands on Machine Learning, Scikit-Learn',
                'author' => 'Geron Aurelien',
                'description' => 'The practical book to show you how to learn machine learning
                by using concrete examples, minimal theory and two production-ready Python frameworks ',
                'genre' => 'Technology',
                'price' => 0.00,
                'is_free' => true,
                'rating' => 4.8,
                'cover_image' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScJw7p133PJmwpFQfSrnjgeVoWiYCmKFRcyg&s',
                'pdf_file_path' => 'pdfs/hands-on-machine-learning.pdf',
                'featured' => true,
                'editors_pick' => true,
                'publication_date' => '2017-01-01'
            ],
            [
                'title' => 'Atomic Habits',
                'author' => 'James Clear',
                'description' => 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. Transform your life with tiny changes in behavior that lead to remarkable results.',
                'genre' => 'Self-Help',
                'price' => 12.99,
                'is_free' => false,
                'rating' => 4.9,
                'cover_image' => 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg',
                'pdf_file_path' => 'pdfs/atomic-habits.pdf',
                'featured' => true,
                'editors_pick' => false,
                'publication_date' => '2018-10-16'
            ],
            [
                'title' => 'Clean Code',
                'author' => 'Robert C. Martin',
                'description' => 'A handbook of agile software craftsmanship. Learn to write clean, maintainable code that stands the test of time.',
                'genre' => 'Technology',
                'price' => 0.00,
                'is_free' => true,
                'rating' => 4.6,
                'cover_image' => 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436202607i/3735293.jpg',
                'pdf_file_path' => 'pdfs/clean-code.pdf',
                'featured' => false,
                'editors_pick' => true,
                'publication_date' => '2008-08-01'
            ],
            [
                'title' => 'The Lean Startup',
                'author' => 'Eric Ries',
                'description' => 'How todays entrepreneurs use continuous innovation to create radically successful businesses.',
                'genre' => 'Business',
                'price' => 15.99,
                'is_free' => false,
                'rating' => 4.5,
                'cover_image' => 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1333576876i/10127019.jpg',
                'pdf_file_path' => 'pdfs/lean-startup.pdf',
                'featured' => true,
                'editors_pick' => false,
                'publication_date' => '2011-09-13'
            ],
            [
                'title' => 'Sapiens: A Brief History of Humankind',
                'author' => 'Yuval Noah Harari',
                'description' => 'From animals into gods: how we became human. An exploration of human history and our impact on the world.',
                'genre' => 'History',
                'price' => 0.00,
                'is_free' => true,
                'rating' => 4.7,
                'cover_image' => 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1703329310i/23692271.jpg',
                'pdf_file_path' => 'pdfs/sapiens.pdf',
                'featured' => true,
                'editors_pick' => true,
                'publication_date' => '2014-09-04'
            ],
            [
                'title' => 'Think and Grow Rich',
                'author' => 'Napoleon Hill',
                'description' => 'The timeless classic revealing the secret to wealth and success. Based on interviews with successful people.',
                'genre' => 'Self-Help',
                'price' => 0.00,
                'is_free' => true,
                'rating' => 4.4,
                'cover_image' => 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1463241782i/30186948.jpg',
                'pdf_file_path' => 'pdfs/think-and-grow-rich.pdf',
                'featured' => false,
                'editors_pick' => false,
                'publication_date' => '1937-01-01'
            ],
            [
                'title' => 'The 7 Habits of Highly Effective People',
                'author' => 'Stephen R. Covey',
                'description' => 'Powerful lessons in personal change. A holistic approach to effectiveness in personal and professional life.',
                'genre' => 'Self-Help',
                'price' => 13.99,
                'is_free' => false,
                'rating' => 4.6,
                'cover_image' => 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1421842784i/36072.jpg',
                'pdf_file_path' => 'pdfs/7-habits.pdf',
                'featured' => false,
                'editors_pick' => true,
                'publication_date' => '1989-08-15'
            ],
            [
                'title' => 'Educated',
                'author' => 'Tara Westover',
                'description' => 'A memoir about education, family, and the struggle for self-invention. A powerful story of transformation.',
                'genre' => 'Biography',
                'price' => 16.99,
                'is_free' => false,
                'rating' => 4.8,
                'cover_image' => 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1506026635i/35133922.jpg',
                'pdf_file_path' => 'pdfs/educated.pdf',
                'featured' => true,
                'editors_pick' => false,
                'publication_date' => '2018-02-20'
            ],
            [
                'title' => 'The Subtle Art of Not Giving a F*ck',
                'author' => 'Mark Manson',
                'description' => 'A counterintuitive approach to living a good life. Learn to focus on what truly matters.',
                'genre' => 'Self-Help',
                'price' => 14.99,
                'is_free' => false,
                'rating' => 4.3,
                'cover_image' => 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1465761302i/28257707.jpg',
                'pdf_file_path' => 'pdfs/subtle-art.pdf',
                'featured' => false,
                'editors_pick' => false,
                'publication_date' => '2016-09-13'
            ],
            [
                'title' => 'Design Patterns: Elements of Reusable Object-Oriented Software',
                'author' => 'Gang of Four',
                'description' => 'The classic reference for software design patterns. Essential reading for software architects and developers.',
                'genre' => 'Technology',
                'price' => 0.00,
                'is_free' => true,
                'rating' => 4.5,
                'cover_image' => 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1348027904i/85009.jpg',
                'pdf_file_path' => 'pdfs/design-patterns.pdf',
                'featured' => false,
                'editors_pick' => true,
                'publication_date' => '1994-10-21'
            ],
            [
                'title' => 'The Innovators Dilemma',
                'author' => 'Clayton M. Christensen',
                'description' => 'When new technologies cause great firms to fail. Understanding disruptive innovation in business.',
                'genre' => 'Business',
                'price' => 18.99,
                'is_free' => false,
                'rating' => 4.4,
                'cover_image' => 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1347654027i/2615.jpg',
                'pdf_file_path' => 'pdfs/innovators-dilemma.pdf',
                'featured' => false,
                'editors_pick' => false,
                'publication_date' => '1997-01-01'
            ]

        ];

        foreach ($books as $book) {
            // Save book first
            $createdBook = Book::create($book);

            // Get embedding for title + description
            $text = $book['title'] . '. ' . $book['description'];

            $response = Http::withHeaders([
                'x-goog-api-key' => env('GEMINI_API_KEY'),
                'Content-Type' => 'application/json',
            ])->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent', [
                'content' => [
                    'parts' => [
                        ['text' => $text]
                    ]
                ],
                'taskType' => 'SEMANTIC_SIMILARITY',
                'outputDimensionality' => 768 
                
            ]);

            if ($response->successful()) {
                $embedding = $response->json('embedding.values'); 
                
            
                $createdBook->update([
                    'embedding' => $embedding
                ]);
            } else {
                dump("Embedding failed for book: " . $book['title']);
            }
        }
    }
}
