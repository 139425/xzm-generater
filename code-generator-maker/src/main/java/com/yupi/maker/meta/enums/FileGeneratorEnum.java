package com.yupi.maker.meta.enums;

public enum FileGeneratorEnum {
    DYNAMIC("动态","dynamic"),
    STATIC("静态","static");

    private String text;

    private String value;

    FileGeneratorEnum(String text, String value) {
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
