<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Book;
use App\Models\UserBookDownload;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DummyUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find or create the dummy user
        $dummyUser = User::firstOrCreate(
            ['email' => 'john.doe@example.com'],
            [
                'name' => 'John Doe',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
            ]
        );

        // Clear existing downloads for this user
        UserBookDownload::where('user_id', $dummyUser->id)->delete();

        // Get first 2 books from the database (assuming books are already seeded)
        $books = Book::limit(2)->get();

        if ($books->count() < 2) {
            // If there are less than 2 books, create some dummy books
            $book1 = Book::create([
                'title' => 'Dummy Book 1 - Programming Basics',
                'author' => 'Tech Author',
                'description' => 'A comprehensive guide to programming fundamentals',
                'genre' => 'Technology',
                'price' => 0.00,
                'is_free' => true,
                'rating' => 4.5,
                'cover_image' => 'https://via.placeholder.com/300x400?text=Programming+Basics',
                'pdf_file_path' => 'pdfs/programming-basics.pdf',
                'featured' => false,
                'editors_pick' => false,
                'publication_date' => '2023-01-01'
            ]);

            $book2 = Book::create([
                'title' => 'Dummy Book 2 - Web Development',
                'author' => 'Web Developer',
                'description' => 'Learn modern web development techniques',
                'genre' => 'Technology',
                'price' => 15.99,
                'is_free' => false,
                'rating' => 4.7,
                'cover_image' => 'https://via.placeholder.com/300x400?text=Web+Development',
                'pdf_file_path' => 'pdfs/web-development.pdf',
                'featured' => true,
                'editors_pick' => false,
                'publication_date' => '2023-06-01'
            ]);

            $books = collect([$book1, $book2]);
        }

        // Create download records for the dummy user
        foreach ($books as $book) {
            UserBookDownload::create([
                'user_id' => $dummyUser->id,
                'book_id' => $book->id,
                'downloaded_at' => now()->subDays(rand(1, 30)) // Random download date within last 30 days
            ]);
        }

        $this->command->info('Dummy user created successfully!');
        $this->command->info('User: ' . $dummyUser->name . ' (' . $dummyUser->email . ')');
        $this->command->info('Downloaded books: ' . $books->pluck('title')->implode(', '));
    }
}