package com.yupi.maker.meta.enums;

public enum FileTypeEnum {
    FILE("文件","file"),
    DIR("目录","dir");

    private String text;

    private String value;

    FileTypeEnum(String text, String value) {
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
