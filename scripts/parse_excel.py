import zipfile
import xml.etree.ElementTree as ET
import json
import os

excel_path = '/Users/eminseferaliev/Desktop/Школа/Информатика_7-9_классы.xlsx'
output_json_path = '/Users/eminseferaliev/Desktop/Школа/src/data/curriculum.json'

os.makedirs(os.path.dirname(output_json_path), exist_ok=True)

with zipfile.ZipFile(excel_path) as z:
    wb_xml = z.read('xl/workbook.xml')
    root = ET.fromstring(wb_xml)
    sheets = [e.attrib['name'] for e in root.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheet')]
    
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        ss_xml = z.read('xl/sharedStrings.xml')
        ss_root = ET.fromstring(ss_xml)
        for si in ss_root.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
            text = ''.join([t.text for t in si.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') if t.text])
            shared_strings.append(text)

    def get_sheet_rows_and_hyperlinks(sheet_idx):
        sheet_path = f'xl/worksheets/sheet{sheet_idx}.xml'
        rels_path = f'xl/worksheets/_rels/sheet{sheet_idx}.xml.rels'

        rel_map = {}
        if rels_path in z.namelist():
            r_xml = z.read(rels_path)
            r_root = ET.fromstring(r_xml)
            for r in r_root.iter('{http://schemas.openxmlformats.org/package/2006/relationships}Relationship'):
                rid = r.attrib.get('Id')
                target = r.attrib.get('Target')
                rel_map[rid] = target

        hyperlinks_map = {}
        if sheet_path in z.namelist():
            s_xml = z.read(sheet_path)
            s_root = ET.fromstring(s_xml)
            for h in s_root.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}hyperlink'):
                ref = h.attrib.get('ref')
                rid = h.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
                target = rel_map.get(rid)
                if target:
                    hyperlinks_map[ref] = target

            rows = []
            for row in s_root.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
                r_idx = int(row.attrib.get('r'))
                cells = {}
                for c in row.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                    ref = c.attrib.get('r')
                    col_letter = ''.join([ch for ch in ref if ch.isalpha()])
                    t = c.attrib.get('t')
                    v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                    val = v.text if v is not None else ''
                    if t == 's' and val.isdigit() and int(val) < len(shared_strings):
                        val = shared_strings[int(val)]
                    is_el = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}is')
                    if is_el is not None:
                        val = ''.join([t.text for t in is_el.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') if t.text])
                    cells[col_letter] = val.strip()
                rows.append((r_idx, cells))
            return sorted(rows, key=lambda x: x[0]), hyperlinks_map
        return [], {}

    # 1. Parse Оглавление
    oglav_rows, oglav_links = get_sheet_rows_and_hyperlinks(sheets.index('Оглавление') + 1)
    
    overview = {
        "title": "Информатика. 7–9 классы",
        "subtitle": "Домашние задания и авторские конспекты к 69 темам из приложенных перечней.",
        "gradeSummaries": [],
        "guides": [],
        "references": []
    }

    for r_idx, cells in oglav_rows:
        a = cells.get('A', '')
        b = cells.get('B', '')
        c = cells.get('C', '')
        d = cells.get('D', '')

        if a in ['7 класс', '8 класс', '9 класс']:
            overview["gradeSummaries"].append({
                "grade": a,
                "description": b,
                "topicsCount": int(c) if c.isdigit() else 0,
                "note": d
            })
        elif a and b and not a.startswith('Информатика') and not a.endswith('перечень') and not a.startswith('Python') and a != 'Класс':
            overview["guides"].append({
                "title": a,
                "content": b
            })
        elif a and b and (a.endswith('перечень') or a.startswith('Python')):
            link_ref = oglav_links.get(f'B{r_idx}')
            overview["references"].append({
                "title": a,
                "linkOrDesc": b,
                "url": link_ref
            })

    # 2. Parse 7, 8, 9 grades and conspects
    all_grades = {}

    for grade in ['7', '8', '9']:
        topic_sheet = f'{grade} класс'
        conspect_sheet = f'Конспекты {grade}'

        t_rows, t_links = get_sheet_rows_and_hyperlinks(sheets.index(topic_sheet) + 1)
        c_rows, c_links = get_sheet_rows_and_hyperlinks(sheets.index(conspect_sheet) + 1)

        # Parse conspects first into map by section
        conspects_map = {}
        curr_conspect = None
        curr_presentation_url = None

        for r_idx, c in c_rows:
            a, b, c_val = c.get('A', ''), c.get('B', ''), c.get('C', '')
            if a.startswith('§'):
                if curr_conspect:
                    sec_clean = curr_conspect['section'].replace('§ ', '').replace('§', '').strip()
                    conspects_map[sec_clean] = (curr_conspect, curr_presentation_url)
                curr_conspect = {
                    "section": a,
                    "title": b,
                    "duration": c_val,
                    "stages": []
                }
                curr_presentation_url = None
            elif curr_conspect and (a or b or c_val):
                curr_conspect["stages"].append({
                    "label": a,
                    "content": b,
                    "time": c_val
                })
                # Check for presentation hyperlink on B column cell
                cell_ref = f'B{r_idx}'
                if cell_ref in c_links and c_links[cell_ref].startswith('http'):
                    curr_presentation_url = c_links[cell_ref]

        if curr_conspect:
            sec_clean = curr_conspect['section'].replace('§ ', '').replace('§', '').strip()
            conspects_map[sec_clean] = (curr_conspect, curr_presentation_url)

        # Parse topics
        topics_list = []
        for r_idx, c in t_rows:
            section = c.get('A', '')
            title = c.get('B', '')
            hw = c.get('C', '')
            extra = c.get('D', '')
            answers = c.get('E', '')

            if (section.startswith('§') or (section and section[0].isdigit() and '.' in section)) and section != '§':
                sec_num = section.replace('§ ', '').replace('§', '').strip()
                sec_formatted = f'§ {sec_num}'
                
                matched_data = conspects_map.get(sec_num, (None, None))
                matched_conspect, presentation_url = matched_data

                topics_list.append({
                    "id": f"{grade}-{sec_num}",
                    "grade": int(grade),
                    "section": sec_formatted,
                    "secNum": sec_num,
                    "title": title,
                    "homework": hw,
                    "extraHomework": extra,
                    "answersAndCriteria": answers,
                    "presentationUrl": presentation_url,
                    "conspect": matched_conspect
                })

        all_grades[grade] = topics_list

    final_data = {
        "overview": overview,
        "grades": all_grades
    }

    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False, indent=2)

print(f"Successfully generated {output_json_path} with direct PDF URLs!")
