from PIL import Image

def remove_white_bg(img_path, out_path):
    try:
        img = Image.open(img_path).convert("RGBA")
        datas = img.getdata()
        new_data = []
        for item in datas:
            # Change white to transparent
            if item[0] > 230 and item[1] > 230 and item[2] > 230:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)
        img.putdata(new_data)
        img.save(out_path, "PNG")
        print(f"Saved {out_path}")
    except Exception as e:
        print(e)

remove_white_bg("assets/sitting_ai_assistant.jpg", "assets/sitting_ai_assistant.png")
remove_white_bg("assets/waving_ai_assistant.jpg", "assets/waving_ai_assistant.png")
