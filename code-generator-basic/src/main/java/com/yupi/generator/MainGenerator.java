package com.yupi.generator;

import com.yupi.model.MainTempleteConfig;
import freemarker.template.TemplateException;

import java.io.File;
import java.io.IOException;

public class MainGenerator {
    public static void main(String[] args) throws TemplateException, IOException {
        MainTempleteConfig mainTemplateConfig = new MainTempleteConfig();
        mainTemplateConfig.setAuthor("xzm");
        mainTemplateConfig.setLoop(false);
        mainTemplateConfig.setOutputText("求和结果：");
        doGenerator(mainTemplateConfig);
    }

    public static void doGenerator(Object model) throws TemplateException, IOException {

        String projectPath = System.getProperty("user.dir")+ File.separator + "code-generator-basic";
        File parentFile = new File(projectPath).getParentFile();
        String inputPath = new File(parentFile, "code-generator-demo-projects/acm-template").getAbsolutePath();
        String outputPath = projectPath;

        //生成静态文件
        StaticGenerator.copyFilesByHutool(inputPath, outputPath);

        //生成动态文件
        String inputDynamicPath = projectPath + File.separator + "src/main/resources/templates/MainTemplete.java.ftl";
        String outputDynamicPath = projectPath + File.separator + "acm-template/src/com/yupi/acm/MainTemplete.java";
        DynamicGenerator.doGenerate(inputDynamicPath, outputDynamicPath, model);
    }
}
