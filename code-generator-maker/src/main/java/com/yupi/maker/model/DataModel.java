package com.yupi.maker.model;


import lombok.Data;

/**
 * 动态模板配置
 */

@Data
public class DataModel {

    /**
     * 是否生成.gitignore文件
     */
    public boolean needGit = true;

    /**
     * 是否循环
     */
    public boolean loop = false;

    /**
     * 作者注释
     */
    public String author = "yupi";

    /**
     * 输出信息
     */
    public String outputText = "sum = ";



}
