package com.yupi.maker.generator;

import java.io.*;

public class JarGenerator {

    public static void doGenerator(String projectDir) throws IOException, InterruptedException {
        //清理之前的构建并打包
        String winMavenCommand = "mvn.cmd clean package -DskipTests=true";
        String OtherMavenCommand = "mvn clean package -DskipTests=true";
        String MavenCommand = winMavenCommand;

        ProcessBuilder processBuilder = new ProcessBuilder(MavenCommand.split(" "));
        processBuilder.directory(new File(projectDir));
        Process process = processBuilder.start();

        //读取命令的输入
        InputStream inputStream = process.getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        String line ;
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }

        //等待命令执行完成
        int exitCode = process.waitFor();
        System.out.println("命令执行完成，退出码为：" + exitCode);

    }

    public static void main(String[] args) throws IOException, InterruptedException {
        doGenerator("C:\\Java\\code-generator\\code-generator-basic");
    }
}
