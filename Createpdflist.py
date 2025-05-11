import os
from collections import defaultdict

# Adjust folder path to your local machine
folder_path = r'C:\Users\ronan\OneDrive\Desktop\Projects\Atlas-Repository\pdf'
output_file = r'C:\Users\ronan\OneDrive\Desktop\Projects\Atlas-Repository\atlas_list.html'

groups = defaultdict(list)

# Scan PDFs in the folder
for filename in os.listdir(folder_path):
    if filename.endswith('.pdf'):
        name_part = filename[:-4]  # Remove .pdf extension
        parts = name_part.split('_', 1)  # Split at first underscore only

        if len(parts) == 2:
            group = parts[0].strip()
            title_part = parts[1].strip()

            # Always remove trailing '_Atlas' if present
            if title_part.endswith('_Atlas'):
                title = title_part[:-6].strip()  # Remove '_Atlas'
            else:
                title = title_part

            groups[group].append((title, filename))
        else:
            print(f"Warning: Skipped (no underscore found) → {filename}")

# Build HTML output
html_output = '<div class="panel" onclick="togglePanel(this)">\n'
html_output += '    <div class="panel-header">Atlases</div>\n'
html_output += '    <div class="panel-content">\n'

for group in sorted(groups.keys()):
    html_output += f'        <div class="group" onclick="toggleGroup(event, this)">\n'
    html_output += f'            <div class="group-header">{group}</div>\n'
    html_output += f'            <ul class="group-content">\n'
    for title, file_name in sorted(groups[group], key=lambda x: x[0]):
        html_output += f'                <li><a href="#" onclick="openPDF(\'{file_name}\')">{title}</a></li>\n'
    html_output += f'            </ul>\n'
    html_output += f'        </div>\n'

html_output += '    </div>\n'
html_output += '</div>\n'

# Write to output file
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(html_output)

print(f'Generated {output_file}')

