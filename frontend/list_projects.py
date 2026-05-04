import json
with open('/Users/bbaebae/.gemini/antigravity/brain/e1afb821-52d3-4eb2-b92d-b76e7506fb87/.system_generated/steps/215/output.txt', 'r') as f:
    data = json.load(f)
    for p in data.get('projects', []):
        print(f"ID: {p['name']}, Title: {p.get('title')}")
