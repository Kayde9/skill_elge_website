"""
Image Optimization Script for SKILL ELGE Website
This script compresses and optimizes all images in the Images directory
to improve website loading performance.
"""

import os
from PIL import Image
import sys

def optimize_image(image_path, output_path=None, quality=85, max_width=1920):
    """
    Optimize an image by compressing and resizing if necessary.
    
    Args:
        image_path: Path to the input image
        output_path: Path for the output image (if None, overwrites original)
        quality: JPEG quality (1-100, default 85)
        max_width: Maximum width in pixels (default 1920)
    """
    try:
        # Open the image
        img = Image.open(image_path)
        
        # Get original size
        original_size = os.path.getsize(image_path)
        original_width, original_height = img.size
        
        # Convert RGBA to RGB if necessary (for JPEG)
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        
        # Resize if image is too large
        if original_width > max_width:
            ratio = max_width / original_width
            new_height = int(original_height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            print(f"  Resized from {original_width}x{original_height} to {max_width}x{new_height}")
        
        # Set output path
        if output_path is None:
            output_path = image_path
        
        # Determine format and save
        file_ext = os.path.splitext(image_path)[1].lower()
        
        if file_ext in ['.jpg', '.jpeg']:
            # Optimize JPEG
            img.save(output_path, 'JPEG', quality=quality, optimize=True, progressive=True)
        elif file_ext == '.png':
            # Optimize PNG
            img.save(output_path, 'PNG', optimize=True)
        else:
            # For other formats, convert to JPEG
            output_path = os.path.splitext(output_path)[0] + '.jpg'
            img.save(output_path, 'JPEG', quality=quality, optimize=True, progressive=True)
        
        # Get new size
        new_size = os.path.getsize(output_path)
        reduction = ((original_size - new_size) / original_size) * 100
        
        print(f"  Original: {original_size / 1024:.1f} KB")
        print(f"  Optimized: {new_size / 1024:.1f} KB")
        print(f"  Reduction: {reduction:.1f}%")
        
        return True
        
    except Exception as e:
        print(f"  Error: {str(e)}")
        return False

def optimize_directory(directory_path, quality=85, max_width=1920):
    """
    Optimize all images in a directory and its subdirectories.
    
    Args:
        directory_path: Path to the directory containing images
        quality: JPEG quality (1-100, default 85)
        max_width: Maximum width in pixels (default 1920)
    """
    total_original = 0
    total_optimized = 0
    count = 0
    
    # Supported image extensions
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'}
    
    print(f"\nOptimizing images in: {directory_path}")
    print(f"Quality: {quality}, Max Width: {max_width}px")
    print("-" * 60)
    
    # Walk through directory
    for root, dirs, files in os.walk(directory_path):
        for filename in files:
            file_ext = os.path.splitext(filename)[1].lower()
            
            if file_ext in image_extensions:
                file_path = os.path.join(root, filename)
                print(f"\nProcessing: {filename}")
                
                original_size = os.path.getsize(file_path)
                total_original += original_size
                
                # Optimize the image
                if optimize_image(file_path, quality=quality, max_width=max_width):
                    count += 1
                    total_optimized += os.path.getsize(file_path)
    
    # Print summary
    print("\n" + "=" * 60)
    print("OPTIMIZATION SUMMARY")
    print("=" * 60)
    print(f"Images processed: {count}")
    print(f"Total original size: {total_original / (1024 * 1024):.2f} MB")
    print(f"Total optimized size: {total_optimized / (1024 * 1024):.2f} MB")
    
    if total_original > 0:
        total_reduction = ((total_original - total_optimized) / total_original) * 100
        print(f"Total reduction: {total_reduction:.1f}%")
        print(f"Space saved: {(total_original - total_optimized) / (1024 * 1024):.2f} MB")

def main():
    """Main function to run the optimization."""
    print("=" * 60)
    print("SKILL ELGE Website - Image Optimization Tool")
    print("=" * 60)
    
    # Get the Images directory path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    images_dir = os.path.join(script_dir, 'Images')
    
    if not os.path.exists(images_dir):
        print(f"\nError: Images directory not found at {images_dir}")
        print("Please make sure you're running this script from the website root directory.")
        return
    
    # Ask user for confirmation
    print(f"\nThis will optimize all images in: {images_dir}")
    print("Original images will be overwritten!")
    response = input("\nDo you want to continue? (yes/no): ").strip().lower()
    
    if response not in ['yes', 'y']:
        print("Optimization cancelled.")
        return
    
    # Get optimization settings
    try:
        quality = int(input("\nEnter JPEG quality (1-100, recommended 85): ") or "85")
        quality = max(1, min(100, quality))
    except ValueError:
        quality = 85
    
    try:
        max_width = int(input("Enter maximum width in pixels (recommended 1920): ") or "1920")
    except ValueError:
        max_width = 1920
    
    # Run optimization
    optimize_directory(images_dir, quality=quality, max_width=max_width)
    
    print("\n" + "=" * 60)
    print("Optimization complete!")
    print("=" * 60)
    print("\nRecommendations:")
    print("1. Test your website to ensure images look good")
    print("2. Check the browser console for any loading issues")
    print("3. Consider using WebP format for even better compression")
    print("4. Enable browser caching in your web server configuration")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nOptimization cancelled by user.")
    except Exception as e:
        print(f"\n\nAn error occurred: {str(e)}")
        import traceback
        traceback.print_exc()
