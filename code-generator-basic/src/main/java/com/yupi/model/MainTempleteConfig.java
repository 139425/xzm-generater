package com.yupi.model;


import lombok.Data;

/**
 * 动态模板配置
 */

@Data
public class MainTempleteConfig {

    private String author = "xzm";

    private String outputText = "sum = ";

    private boolean loop = false;

}
