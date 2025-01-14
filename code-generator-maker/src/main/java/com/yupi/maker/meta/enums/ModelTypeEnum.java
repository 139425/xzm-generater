package com.yupi.maker.meta.enums;

public enum ModelTypeEnum {
    STRING("字符串","String"),
    BOOLEAN("布尔","bool");

    private String text;

    private String value;

    ModelTypeEnum(String text, String value) {
        this.text = text;
        this.value = value;
    }

    public String getText() {
        return text;
    }

    public String getValue() {
        return value;
    }
}
