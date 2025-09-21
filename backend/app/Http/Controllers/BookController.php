<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BookController extends Controller
{
    public function index(Request $request)
    {
        \Log::info('Book index endpoint hit');
        try {
            $query = Book::query();

            // Search functionality
            if ($request->has('search') && $request->search) {
                $searchTerm = $request->search;
                $query->where(function($q) use ($searchTerm) {
                    $q->where('title', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('author', 'LIKE', "%{$searchTerm}%");
                });
            }

            // Filter by genre
            if ($request->has('genre') && $request->genre) {
                $query->where('genre', $request->genre);
            }

            // Filter by price
            if ($request->has('price_filter')) {
                if ($request->price_filter === 'free') {
                    $query->where('is_free', true);
                } elseif ($request->price_filter === 'paid') {
                    $query->where('is_free', false);
                }
            }

            // Filter by rating
            if ($request->has('min_rating')) {
                $query->where('rating', '>=', $request->min_rating);
            }

            // Filter featured books
            if ($request->has('featured') && $request->featured) {
                $query->where('featured', true);
            }

            // Filter editor's picks
            if ($request->has('editors_pick') && $request->editors_pick) {
                $query->where('editors_pick', true);
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Get books with pagination
            $books = $query->paginate($request->get('per_page', 50));

            \Log::info('Books fetched successfully', ['count' => $books->count()]);

            return response()->json([
                'status' => 'success',
                'data' => $books
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching books: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch books'
            ], 500);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Get all books without pagination for now, or use a larger page size
        $books = $query->paginate($request->get('per_page', 50));

        return response()->json([
            'status' => 'success',
            'data' => $books
        ]);
    }

    public function show($id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json([
                'status' => 'error',
                'message' => 'Book not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $book
        ]);
    }

    public function getFeatured()
    {
        $books = Book::where('featured', true)->get();

        return response()->json([
            'status' => 'success',
            'data' => $books
        ]);
    }

    public function getFreeBooks()
    {
        $books = Book::where('is_free', true)->get();

        return response()->json([
            'status' => 'success',
            'data' => $books
        ]);
    }

    public function getEditorsPicks()
    {
        $books = Book::where('editors_pick', true)->get();

        return response()->json([
            'status' => 'success',
            'data' => $books
        ]);
    }

    public function downloadPdf($id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json([
                'status' => 'error',
                'message' => 'Book not found'
            ], 404);
        }

        try {
            if (!$book->pdf_file_path) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No PDF file associated with this book'
                ], 404);
            }

            // Always try to get from S3 first
            try {
                \Log::info('Attempting to download book: ' . $book->id . ' - ' . $book->title);
                \Log::info('PDF path: ' . $book->pdf_file_path);

                // Ensure the file exists in S3
                if (!Storage::disk('s3')->exists($book->pdf_file_path)) {
                    \Log::error('File not found in S3: ' . $book->pdf_file_path);
                    throw new \Exception('File not found in S3');
                }

                $url = Storage::disk('s3')->temporaryUrl(
                    $book->pdf_file_path,
                    now()->addMinutes(5),
                    [
                        'ResponseContentDisposition' => 'attachment; filename="' . $book->title . '.pdf"',
                        'ResponseContentType' => 'application/pdf',
                        'ACL' => 'public-read'
                    ]
                );
                
                // Log successful URL generation
                \Log::info('Generated S3 URL for file: ' . $url);
                
                return response()->json([
                    'status' => 'success',
                    'download_url' => $url,
                    'message' => 'URL generated successfully'
                ]);
            } catch (\Exception $e) {
                \Log::error('S3 download failed: ' . $e->getMessage());
                
                // Fallback to local storage
                $filePath = storage_path('app/public/' . $book->pdf_file_path);

                if (!file_exists($filePath)) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'PDF file not found'
                    ], 404);
                }

                return response()->download($filePath, $book->title . '.pdf', [
                    'Content-Type' => 'application/pdf'
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to download file'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'genre' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'pdf_file' => 'required|file|mimes:pdf|max:10240', // 10MB max
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        // Handle PDF file upload
        $pdfPath = null;
        $cloudUrl = null;
        if ($request->hasFile('pdf_file')) {
            $file = $request->file('pdf_file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $pdfPath = 'pdfs/' . $filename;
            
            // Upload to S3
            Storage::disk('s3')->put($pdfPath, file_get_contents($file));
            $cloudUrl = Storage::disk('s3')->url($pdfPath);
        }

        // Handle cover image upload
        $coverImagePath = null;
        if ($request->hasFile('cover_image')) {
            $coverImagePath = $request->file('cover_image')->store('covers', 's3');
        }

        $book = Book::create([
            'title' => $request->title,
            'author' => $request->author,
            'description' => $request->description,
            'genre' => $request->genre,
            'price' => $request->price,
            'is_free' => $request->boolean('is_free'),
            'rating' => $request->rating ?? 0,
            'cover_image' => $coverImagePath,
            'pdf_file_path' => $pdfPath,
            'cloud_url' => $cloudUrl,
            'isbn' => $request->isbn,
            'publication_date' => $request->publication_date,
            'featured' => $request->boolean('featured'),
            'editors_pick' => $request->boolean('editors_pick')
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Book created successfully',
            'data' => $book
        ], 201);
    }
}
