import os
from collections import defaultdict

# Adjust folder path to your local machine
folder_path = r'C:\Users\ronan\OneDrive\Desktop\Projects\Atlas-Repository\guidelines'
output_file = 'guidelines_list.html'

groups = defaultdict(list)

# Scan PDFs in the folder
for filename in os.listdir(folder_path):
    if filename.endswith('.pdf'):
        name_part = filename[:-4]
        parts = name_part.split('_', 1)
        if len(parts) == 2:
            cancer_site = parts[0].strip()
            year_title_parts = parts[1].split('-', 1)
            if len(year_title_parts) == 2:
                year = year_title_parts[0].strip()
                title = year_title_parts[1].strip()
                groups[cancer_site].append((year, title, filename))

# Build HTML output
html_output = '<div class="panel" onclick="togglePanel(this)">\n'
html_output += '    <div class="panel-header">Published Guidelines</div>\n'
html_output += '    <div class="panel-content">\n'

for site in sorted(groups.keys()):
    html_output += f'        <div class="group" onclick="toggleGroup(event, this)">\n'
    html_output += f'            <div class="group-header">{site}</div>\n'
    html_output += f'            <table class="group-content" style="width: 100%;">\n'
    for year, title, file_name in sorted(groups[site], key=lambda x: (x[0], x[1])):
        html_output += f'                <tr>\n'
        html_output += f'                    <td style="padding-right: 10px; color: gray; text-align: left;">{year}</td>\n'
        html_output += f'                    <td style="text-align: left;">{title}</td>\n'
        html_output += f'                    <td style="padding-left: 10px; text-align: right;"><a href="guidelines/{file_name}" target="_blank">Open PDF</a></td>\n'
        html_output += f'                </tr>\n'
    html_output += f'            </table>\n'
    html_output += f'        </div>\n'

html_output += '    </div>\n'
html_output += '</div>\n'

# Write to output file
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(html_output)

print(f'Generated {output_file}')


