---
title: "P2-问卷代码示例-已脱敏【自动化填问卷的第一桶金，半小时一百块】"
date: "2024-11-06 21:50:09.899688"
updated: "2024-11-06 23:53:35.064787"
privacy: "登录可见"
visit_count: 38
legacy_id: 22
legacy_unique_id: "22"
---

# P2-问卷代码示例-已脱敏【自动化填问卷的第一桶金，半小时一百块】

> 已更新  
> 视频  
> > 1. [Python自动化填写问卷星](https://www.bilibili.com/video/BV1b94y1n7J2/)  
> > 2. [自动化填问卷的第一桶金，半小时一百块](https://www.bilibili.com/video/BV1BSDTYnEoa/)  
> >3. [填问卷不再手动！自动生成自动化代码，一键搞定所有问卷类型！](https://www.bilibili.com/video/BV1AdDLYJEFv/)   
>  
> 文章  
> >1. [Python自动化填写问卷星](http://www.stardream.vip/blog/2)  
> >2. [自动化填问卷的第一桶金，半小时一百块](http://www.stardream.vip/blog/22)  
> >3. [填问卷不再手动！自动生成自动化代码，一键搞定所有问卷类型！](http://www.stardream.vip/blog/23)  


> 无法运行，因为你们没有问卷链接，没有excel，且信息已经完全脱敏
>
>  仅供参考思路

```python
from DrissionPage import ChromiumPage
from time import sleep
from random import choice

page = ChromiumPage()


def input_wenjuan(school_name='啦啦', code='1234', nation='啦啦'):
    tab = page.new_tab()

    lst1_4 = [1, 2, 3, 4]
    lst2_4 = [2, 3, 4]
    lst3_4 = [3, 4]
    tab.get('xxxxxxx')
    tab.ele('xpath://*[@id="app"]/div/form/div/div[3]/div/div[1]/div/div/div/div/div/input').input(school_name)
    while True:
        try:
            tab.ele('啦啦').click()
            # tab.ele('xpath:/html/body/div[3]/div[1]/div[1]/ul/li', timeout=6).click()
            break
        except:
            print('没找到')
            sleep(0.5)
    sleep(0.5)
    tab.ele('xpath://*[@id="app"]/div/form/div/div[3]/div/div[2]/div/div/div/div[1]/input').input(code)
    if int(code) >= 331:
        print('xx')
        tab.ele('xpath://*[@id="app"]/div/form/div/div[4]/div/div[1]/div/div/div/div/label[1]/span[1]/input').click()
    else:
        print('xx')
        tab.ele('xpath://*[@id="app"]/div/form/div/div[4]/div/div[1]/div/div/div/div/label[2]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[4]/div/div[2]/div/div/div/div/div/input').click()
    if nation == 'xx':
        tab.ele('xpath:/html/body/div[4]/div[1]/div[1]/ul/li[7]').click()
    else:
        tab.ele('xpath:/html/body/div[4]/div[1]/div[1]/ul/li[1]').click()
    sleep(0.5)
    tab.ele('xpath://*[@id="app"]/div/form/div/div[6]/div/div/div/label[5]/span[1]/input').click()

    tab.ele('xpath://*[@id="app"]/div/form/div/div[7]/div/div/div/label[3]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[8]/div/div/div/label[2]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[9]/div/div/div/label[2]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[11]/div/div/div/div/div/div/label[1]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[12]/div/div/div/div/div/div/label[1]/span[1]/input').click()
    # c03
    tab.ele('xpath://*[@id="app"]/div/form/div/div[13]/div/div/div[1]/div/div/div/label[6]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[14]/div/div/div/div/div/div/label[3]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[15]/div/div/div/div/div/div/label[2]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[17]/div/div/div/div/div/div/label[2]/span[1]/input').click()
    lst = [3, 3, 3, 3, 4]
    tab.ele(
        f'xpath://*[@id="app"]/div/form/div/div[18]/div/div/div/div/div/div/label[{choice(lst)}]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[19]/div/div/div/div/div/div/label[2]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[20]/div/div/div/div/div/div/label[3]/span[1]/input').click()
    lst = [2, 2, 2, 3, 3]
    tab.ele(
        f'xpath://*[@id="app"]/div/form/div/div[21]/div/div/div/div/div/div/label[{choice(lst)}]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[23]/div/div/div/div/div/div/label[1]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[24]/div/div/div/div/div/div/label[1]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[25]/div/div/div/div/div/div/label[1]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[26]/div/div/div/div/div/div/label[1]/span[1]/input').click()
    # F
    tab.ele('xpath://*[@id="app"]/div/form/div/div[28]/div/div/div/div/div/div/label[1]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[29]/div/div/div/div/div/div/label[1]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[30]/div/div/div/div/div/div/label[1]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[31]/div/div/div/div/div/div/label[1]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[32]/div/div/div/div/div/div/label[1]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[33]/div/div/div/div/div/div/label[1]/span[1]/input').click()
    lst = [1, 1, 2, 2, 2, 3, 3]
    tab.ele(
        f'xpath://*[@id="app"]/div/form/div/div[34]/div/div/div/div/div/div/label[{choice(lst)}]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[35]/div/div/div/div/div/div/label[1]/span[1]/input').click()
    # G
    tab.ele('xpath://*[@id="app"]/div/form/div/div[37]/div/div/div/div/div/div/label[1]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[39]/div/div[1]/div/div/div/div/input').input(
        choice(['8', '9', '9', '9']))
    tab.ele('xpath://*[@id="app"]/div/form/div/div[39]/div/div[2]/div/div/div/div/input').input(
        choice(['0', '0', '0', '0', '30']))
    tab.ele('xpath://*[@id="app"]/div/form/div/div[41]/div/div[1]/div/div/div/div/input').input('1')
    tab.ele('xpath://*[@id="app"]/div/form/div/div[41]/div/div[2]/div/div/div/div/input').input(
        choice(['0', '0', '30']))
    # H
    tab.ele('xpath://*[@id="app"]/div/form/div/div[43]/div/div/div/div/div/div/label[4]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[44]/div/div/div/div/div/div/label[3]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[45]/div/div/div/div/div/div/label[2]/span[1]/input').click()
    # I
    tab.ele('xpath://*[@id="app"]/div/form/div/div[47]/div/div/div/div/div/div/label[3]/span[1]/input').click()
    lst = [2, 2, 2, 2, 3, 3, 3]
    tab.ele(
        f'xpath://*[@id="app"]/div/form/div/div[48]/div/div/div/div/div/div/label[{choice(lst)}]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[49]/div/div/div/div/div/div/label[2]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[50]/div/div/div/div/div/div/label[2]/span[1]/input').click()
    lst = [1, 1, 2, 2, 2, 2, 2]
    tab.ele(
        f'xpath://*[@id="app"]/div/form/div/div[51]/div/div/div/div/div/div/label[{choice(lst)}]/span[1]/input').click()
    lst = [1, 1, 1, 1, 1, 2, 3, 3]
    tab.ele(
        f'xpath://*[@id="app"]/div/form/div/div[52]/div/div/div/div/div/div/label[{choice(lst)}]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[53]/div/div/div/div/div/div/label[4]/span[1]/input').click()
    tab.ele('xpath://*[@id="app"]/div/form/div/div[54]/div/div/div/div/div/div/label[4]/span[1]/input').click()

    tab.ele('xpath://*[@id="app"]/div/button').click()
    # sleep(3)
    tab.close()


import pandas as pd

df = pd.read_excel('问卷列表.xls')
df['编号'] = df['编号'].apply(lambda x: f"{x:04d}")
for index, row in df.iterrows():
    code = row['编号']
    name = row['名称']
    nation = '1' if len(name) <= 3 else ''
    print(code, name, nation)
    input_wenjuan(code=code, nation=nation)
print(df.shape)

```
