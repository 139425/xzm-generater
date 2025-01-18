package com.yupi.maker.generator.file;

import freemarker.template.TemplateException;

import java.io.File;
import java.io.IOException;

public class FileGenerator {


    public static void doGenerator(Object model) throws TemplateException, IOException {



        String projectPath = System.getProperty("user.dir")+ File.separator + "code-generator-basic";
        File parentFile = new File(projectPath).getParentFile();
        String inputPath = new File(parentFile, "code-generator-demo-projects/acm-template").getAbsolutePath();
        String outputPath = projectPath;

        //生成静态文件
        StaticFileGenerator.copyFilesByHutool(inputPath, outputPath);

        //生成动态文件
        String inputDynamicPath = projectPath + File.separator + "src/main/resources/templates/MainTemplete.java.ftl.java.ftl";
        String outputDynamicPath = projectPath + File.separator + "acm-template/src/com/yupi/acm/MainTemplete.java.ftl.java";
        DynamicFileGenerator.doGenerate(inputDynamicPath, outputDynamicPath, model);
    }
}
