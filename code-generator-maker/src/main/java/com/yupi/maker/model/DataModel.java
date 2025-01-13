package com.yupi.maker.model;


import lombok.Data;

/**
 * 动态模板配置
 */

@Data
public class DataModel {

    private String author = "xzm";

    private String outputText = "sum = ";

    private boolean loop = false;

}
