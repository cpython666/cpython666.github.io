---
title: "P30-多选列表"
created_at: 2024-12-20 21:44:09
updated_at: 2024-12-20 21:44:09
---

# P30-多选列表

```python
self.hobbies_list = QListWidget()
self.hobbies_list.setSelectionMode(QListWidget.SelectionMode.MultiSelection)
hobbies_items = ["旅行", "阅读", "音乐", "电影", "运动", "美食"]
for item in hobbies_items:
    list_item = QListWidgetItem(item)
    self.hobbies_list.addItem(list_item)
```
