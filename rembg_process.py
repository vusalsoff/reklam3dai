import rembg
from PIL import Image
import io

def process_image(input_path, output_path, scale_factor=0.75):
    print(f"Processing {input_path}...")
    try:
        with open(input_path, 'rb') as f:
            input_data = f.read()
        
        # Remove background using rembg
        output_data = rembg.remove(input_data)
        
        img = Image.open(io.BytesIO(output_data)).convert("RGBA")
        
        # Calculate new size to make it "smaller" within the canvas
        new_w = int(img.width * scale_factor)
        new_h = int(img.height * scale_factor)
        
        # Resize image
        img_resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Create a new blank canvas of the ORIGINAL size
        canvas = Image.new("RGBA", (img.width, img.height), (255, 255, 255, 0))
        
        # Paste the resized image into the bottom-center of the canvas
        offset_x = (img.width - new_w) // 2
        offset_y = img.height - new_h # align to bottom
        
        canvas.paste(img_resized, (offset_x, offset_y), img_resized)
        
        canvas.save(output_path, "PNG")
        print(f"Saved perfectly transparent and scaled image to {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

process_image('assets/waving_caricature.jpg', 'assets/waving_ai_assistant.png', scale_factor=0.75)
process_image('assets/suit_caricature.jpg', 'assets/suit_ai_assistant.png', scale_factor=0.75)
process_image('assets/wizard_caricature.jpg', 'assets/wizard_ai_assistant.png', scale_factor=0.75)
