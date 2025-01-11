package com.yupi.cli.command;

import cn.hutool.core.io.FileUtil;
import picocli.CommandLine;

import java.io.File;
import java.util.List;

//生成所有子文件列表
@CommandLine.Command(name = "list",description = "查看文件列表", mixinStandardHelpOptions = true)
public class ListCommand implements Runnable{

    public void run()
    {
        //整个项目的根路径
        String ProjectPath = System.getProperty("user.dir");
        //输入路径
        String inputPath = new File(ProjectPath,"code-generator-demo-projects/acm-template").getAbsolutePath();
        List<File> fileList = FileUtil.loopFiles(inputPath);
        for(File file:fileList){
            System.out.println(file);
        }
    }
}
