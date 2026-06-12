---
title: "P3-填问卷不再手动！自动生成自动化代码，一键搞定所有问卷类型！"
date: "2024-11-06 21:56:52.679160"
updated: "2024-11-06 23:53:04.303557"
privacy: "会员可见"
visit_count: 6
legacy_id: 23
legacy_unique_id: "23"
---

# P3-填问卷不再手动！自动生成自动化代码，一键搞定所有问卷类型！

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


> 问卷通杀，自动生成自动化填写问卷代码
>
> 问卷秒填神器！自动生成代码，一键搞定所有问卷类型！
>
> 一键生成代码！从此问卷填写不再是烦恼！
>
> 全自动问卷填充教程：轻松解决XPath大难题！
>
> 问卷填到手软？试试这个自动生成脚本的妙招！
>
> 填问卷不再手动！自动生成答案代码，轻松应对各类题型！

经过昨天的复制粘贴大量题目xpath之后，我不禁思考有木有更好的办法，经过我的稍加思考，就想到了一个绝妙的办法。

之前的过程中最耗时的操作无疑就是复制粘贴xpath了。如何解决xpath获取问题呢？页面中题目的操作元素就这几种，直接全部获取然后输出模板，然后按照需求注释或者随机选项即可。

现在最耗时的复制粘贴操作已经直接被解决掉，剩下的就是加点随机答案的小配置

题目类型覆盖不全，但是大部分题目都是这些类型，更不用说类型也可以加到代码支持里面。

<h2 id="oh8dq">代码生成</h2>

```python
from DrissionPage import ChromiumPage

# 初始化页面对象和新标签
page = ChromiumPage()
tab = page.new_tab()
tab.get('http://localhost:8001/page/wenjuan/')

# 获取所有输入框，包括 input、textarea 和 select
questions = tab.eles('xpath://input | //textarea | //select')

for question in questions:
    if question.tag == 'input':
        input_type = question.attr('type')  # 获取 input 的 type 属性
        if input_type == 'text':
            # 处理文本输入框
            print(f"tab.ele('xpath:{question.xpath}').input('Python斗罗') #文本输入 {question}")
            # print("文本输入:", question,question.xpath)
        elif input_type == 'radio':
            # 处理单选按钮
            print(f"tab.ele('xpath:{question.xpath}').click() #单选按钮 {question}")
            # print("单选按钮:", question,question.xpath)

        elif input_type == 'checkbox':
            # 处理复选框
            print(f"tab.ele('xpath:{question.xpath}').click() #复选框 {question}")
            # print("复选框:", question,question.xpath)
        else:
            print("其他输入类型:", input_type, question.xpath)

    elif question.tag == 'textarea':
        # 处理文本区域
        print(f"tab.ele('xpath:{question.xpath}').input(1) #文本区域 {question}")

    elif question.tag == 'select':
        # 处理下拉选择框
        print(f"tab.ele('xpath:{question.xpath}').select.by_index(0) #选择下拉列表 {question}")
        # print("选择下拉列表:", question)
print(f"tab.ele('提交问卷').click() #点击提交按钮")
```

<h2 id="iRO71">代码运行</h2>

```python
from DrissionPage import ChromiumPage

# 初始化页面对象和新标签
page = ChromiumPage()
tab = page.new_tab()
tab.get('http://localhost:8001/page/wenjuan/')

tab.ele('xpath:/html/body/div/div/form/div/input').input('Python斗罗') #文本输入 <ChromiumElement input type='text' class='form-control' id='answer' required=''>
tab.ele('xpath:/html/body/div/div[2]/input').click() #单选按钮 <ChromiumElement input type='radio' name='q1' value='熟悉' id='q1-1'>
tab.ele('xpath:/html/body/div/div[2]/input[2]').click() #单选按钮 <ChromiumElement input type='radio' name='q1' value='一般' id='q1-2'>
tab.ele('xpath:/html/body/div/div[2]/input[3]').click() #单选按钮 <ChromiumElement input type='radio' name='q1' value='不熟悉' id='q1-3'>
tab.ele('xpath:/html/body/div/div[3]/input').click() #单选按钮 <ChromiumElement input type='radio' name='q2' value='有帮助' id='q2-1'>
tab.ele('xpath:/html/body/div/div[3]/input[2]').click() #单选按钮 <ChromiumElement input type='radio' name='q2' value='无帮助' id='q2-2'>
tab.ele('xpath:/html/body/div/div[3]/input[3]').click() #单选按钮 <ChromiumElement input type='radio' name='q2' value='不确定' id='q2-3'>
tab.ele('xpath:/html/body/div/div[4]/textarea').input(1) #文本区域 <ChromiumElement textarea name='q3' id='q3' rows='4' cols='50' placeholder='请输入你的看法'>
tab.ele('xpath:/html/body/div/div[5]/input').click() #复选框 <ChromiumElement input type='checkbox' name='q4' value='数据分析' id='q4-1'>
tab.ele('xpath:/html/body/div/div[5]/input[2]').click() #复选框 <ChromiumElement input type='checkbox' name='q4' value='网站开发' id='q4-2'>
tab.ele('xpath:/html/body/div/div[5]/input[3]').click() #复选框 <ChromiumElement input type='checkbox' name='q4' value='自动化脚本' id='q4-3'>
tab.ele('xpath:/html/body/div/div[5]/input[4]').click() #复选框 <ChromiumElement input type='checkbox' name='q4' value='机器学习' id='q4-4'>
tab.ele('xpath:/html/body/div/div[6]/input').click() #单选按钮 <ChromiumElement input type='radio' name='q5' value='时间管理' id='q5-1'>
tab.ele('xpath:/html/body/div/div[6]/input[2]').click() #单选按钮 <ChromiumElement input type='radio' name='q5' value='难度理解' id='q5-2'>
tab.ele('xpath:/html/body/div/div[6]/input[3]').click() #单选按钮 <ChromiumElement input type='radio' name='q5' value='工具使用' id='q5-3'>
tab.ele('xpath:/html/body/div/div[6]/input[4]').click() #单选按钮 <ChromiumElement input type='radio' name='q5' value='缺乏资源' id='q5-4'>
tab.ele('xpath:/html/body/div/div[7]/select').select.by_index(0) #选择下拉列表 <ChromiumElement select name='q6' id='q6'>
tab.ele('xpath:/html/body/div/div[8]/input').click() #单选按钮 <ChromiumElement input type='radio' name='q7' value='Python' id='q7-1'>
tab.ele('xpath:/html/body/div/div[8]/input[2]').click() #单选按钮 <ChromiumElement input type='radio' name='q7' value='JavaScript' id='q7-2'>
tab.ele('xpath:/html/body/div/div[8]/input[3]').click() #单选按钮 <ChromiumElement input type='radio' name='q7' value='Java' id='q7-3'>
tab.ele('xpath:/html/body/div/div[8]/input[4]').click() #单选按钮 <ChromiumElement input type='radio' name='q7' value='C++' id='q7-4'>
tab.ele('xpath:/html/body/div/div[9]/input').click() #单选按钮 <ChromiumElement input type='radio' name='q8' value='是' id='q8-1'>
tab.ele('xpath:/html/body/div/div[9]/input[2]').click() #单选按钮 <ChromiumElement input type='radio' name='q8' value='否' id='q8-2'>
tab.ele('xpath:/html/body/div/div[10]/input').click() #单选按钮 <ChromiumElement input type='radio' name='q9' value='Selenium' id='q9-1'>
tab.ele('xpath:/html/body/div/div[10]/input[2]').click() #单选按钮 <ChromiumElement input type='radio' name='q9' value='BeautifulSoup' id='q9-2'>
tab.ele('xpath:/html/body/div/div[10]/input[3]').click() #单选按钮 <ChromiumElement input type='radio' name='q9' value='Requests' id='q9-3'>
tab.ele('xpath:/html/body/div/div[10]/input[4]').click() #单选按钮 <ChromiumElement input type='radio' name='q9' value='其他' id='q9-4'>
tab.ele('xpath:/html/body/div/div[11]/textarea').input(1) #文本区域 <ChromiumElement textarea name='q10' id='q10' rows='4' cols='50' placeholder='请输入你的期望或计划'>
tab.ele('xpath:/html/body/div/div[12]/input').input('Python斗罗') #文本输入 <ChromiumElement input type='text' name='q11' id='q11' placeholder='请输入库名称及原因'>
tab.ele('提交问卷').click() #点击提交按钮
```
