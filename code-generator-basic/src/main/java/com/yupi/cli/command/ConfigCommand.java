package com.yupi.cli.command;

import cn.hutool.core.util.ReflectUtil;
import picocli.CommandLine;

import java.lang.reflect.Field;

//输出允许用户传入的动态参数的信息
@CommandLine.Command(name = "config", description = "查看参数信息", mixinStandardHelpOptions = true)
public class ConfigCommand implements Runnable {
    public void run() {
        System.out.println("查看参数信息");
        Field[] fields = ReflectUtil.getFields(GeneratorCommand.class);
        for (Field field : fields) {
            System.out.println("字段名称：" + field.getName());
            System.out.println("字段类型：" + field.getType());
//            System.out.println("Modifiers: " + java.lang.reflect.Modifier.toString(field.getModifiers()));
            System.out.println("---");
        }
    }

}
