import urllib.request
import re
import json
import os

# Google Forms Analytics URL
URL = "https://docs.google.com/forms/d/e/1FAIpQLSeAPSzc9iX7hD8k5a6doS294d16SrUcDDByjMUxuU4Sa1V3dg/viewanalytics"

def fetch_html(url):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        return response.read().decode('utf-8')

def extract_data(html):
    # Common variable names for Google Analytics data
    patterns = [
        r'_viewAnalyticsData\s*=\s*(.*?);',
        r'FB_PUBLIC_LOAD_DATA_\s*=\s*(.*?);',
        r'var\s+analyticsData\s*=\s*(.*?);'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, html, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except:
                continue
    return None

def process_questions(raw):
    # Depending on the version of the form, the data can be at different indices
    # We look for a list that contains question strings and numeric arrays
    try:
        # Search for questions list inside the nested structure
        # raw[1] is the most common location
        questions_list = raw[1]
        formatted = []
        total = 0
        
        for q in questions_list:
            try:
                title = q[1]
                # Look for the counts array (usually 11 points for 0-10)
                data_points = q[3][0]
                counts = [item[0] for item in data_points]
                
                if len(counts) >= 11:
                    formatted.append({"question": title, "data": counts[:11]})
                    if total == 0: total = sum(counts)
            except: continue
        return {"total_responses": total, "questions": formatted}
    except: return None

def main():
    try:
        html = fetch_html(URL)
        raw = extract_data(html)
        if not raw:
            print("Could not extract data directly. You may need to use a browser-based scraper.")
            return

        processed = process_questions(raw)
        if not processed:
            print("Data format not recognized.")
            return

        output_path = os.path.join(os.path.dirname(__file__), "survey_data.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(processed, f, ensure_ascii=False, indent=2)
            
        print(f"Data updated successfully! {processed['total_responses']} responses found.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
