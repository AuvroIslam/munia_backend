<?php

namespace App\Console\Commands;

use App\Models\Book;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class MigratePdfsToS3 extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:migrate-pdfs-to-s3';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate PDFs from local storage to S3';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $books = Book::whereNotNull('pdf_file_path')->get();
        $bar = $this->output->createProgressBar(count($books));
        
        $this->info('Starting PDF migration to S3...');
        $bar->start();
        
        foreach ($books as $book) {
            $localPath = storage_path('app/public/' . $book->pdf_file_path);
            
            if (file_exists($localPath)) {
                try {
                    // Read the local file
                    $fileContents = file_get_contents($localPath);
                    
                    // Generate S3 path (keep the same structure)
                    $s3Path = $book->pdf_file_path;
                    
                    // Upload to S3
                    Storage::disk('s3')->put($s3Path, $fileContents);
                    
                    // Get the S3 URL
                    $cloudUrl = Storage::disk('s3')->url($s3Path);
                    
                    // Update the book record
                    $book->cloud_url = $cloudUrl;
                    $book->save();
                    
                    $this->line("\nMigrated: " . $book->title);
                } catch (\Exception $e) {
                    $this->error("\nFailed to migrate: " . $book->title . " - " . $e->getMessage());
                }
            } else {
                $this->warn("\nFile not found: " . $localPath);
            }
            
            $bar->advance();
        }
        
        $bar->finish();
        $this->info("\nMigration completed!");
    }
}
